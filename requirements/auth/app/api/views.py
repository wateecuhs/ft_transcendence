from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.request import Request
import jwt, os, requests, json, base64, random, qrcode, io, pyotp
from pathlib import Path
from transcendence import settings
from django.core.files.base import ContentFile, File
from django.http import JsonResponse
from django.core.files.storage import FileSystemStorage
from django.conf import settings
from .forms import  BadPasswordError, ConfirmationError
from .models import CustomUser, Match
from django.core.serializers.json import DjangoJSONEncoder
from .serializers import RegisterSerializer, LoginSerializer, EditAccountSerializer, ChangeRoomSerializer, AddMatchSerializer, CodeSerializer, Serializer2FA
from .utils import get_cookie_refresh, checkRefreshToken, CreateAccessToken, CreateRefreshToken, decodeAccessToken, decodeRefreshToken
from django.shortcuts import redirect

"""
register take a POST request of the CustomUserSerializer. The function verify that all fields are valid
and then create the user in DB and create too JWT token for this user. On success return a success message with the encoded_access_jwt and the encoded_refresh_jwt
is send as cookie. On failure return a failed message with an explanation and status
"""
class Register(APIView):
	def post(self, request):
		serializer = RegisterSerializer(data=request.data)
		if not serializer.is_valid():
			errors = serializer.errors
			return JsonResponse({"message": f"failed : serializer is not valid", "errors": errors}, status=400)
		try:
			validated_data = serializer.validated_data
			username = validated_data['username']
			email = validated_data['email']
			password = validated_data['password']
			CustomUser.add_user_by_form(username=username, password=password, email=email, avatar='img/default_pp.jpg')
			encoded_access_jwt = CreateAccessToken(request, username)
			CreateRefreshToken(request, username)
			return JsonResponse({"message": "success", "access_token": encoded_access_jwt}, status=201)
		except ValidationError as e:
			return JsonResponse({"message": f"failed : {e.messages}"}, status=400)

'''
loginAPI take a POST request of the LoginSerializer. The function verify that the user exists with the right password,
then the function recreate JWT token for this user. On success return a JsonResponse with success message and encoded access token,
encoded refresh token is send as cookie. On failure return a JsonResponse with failed message and explanation
'''

class LoginAPI(APIView):
	def post(self, request):
		serializer = LoginSerializer(data=request.data)
		if not serializer.is_valid():
			errors = serializer.errors
			return JsonResponse({"message": f"failed : serializer is not valid", "errors": errors}, status=400)
		username = serializer.validated_data['username']
		password = serializer.validated_data['password']
		user = CustomUser.get_user_by_name(username)
		if not user or not user.check_password(password):
			return JsonResponse({"message": f"failed : authentication failed for {username}"}, status=401)
		encoded_access_jwt = CreateAccessToken(request, username)
		CreateRefreshToken(request, username)
		return JsonResponse({"message": "success", "access_token": encoded_access_jwt})

'''
UserInfo take a PUT request of EditAccountSerializer and the encoded_access_jwt. The function check all field of serializer and change in DB if fields aren't empty and if fields are valid
On success return JsonResponse with success message and all info for this user. On failure return JsonResponse with failed message, explanation and status code.

UserInfo can also take a GET request to return on success all informartions about a user. On failure return JsonResponse with failed message, explanation and status code.
'''

class UserInfo(APIView):
	def put(self, request):
		try:
			authorization_header = request.headers.get('Authorization')
			if authorization_header is None:
				return JsonResponse({"message": "failed : authorization header missing"})
			if not authorization_header.startswith("Bearer "):
				return JsonResponse({'message': 'failed : no access_token in header'})
			encoded_access_jwt = authorization_header.split(" ", 1)[1]
			payload = decodeAccessToken(request, encoded_access_jwt)
			username = payload.get("username")
			user = CustomUser.get_user_by_name(username)
			serializer = EditAccountSerializer(data=request.data, context={'user': user})

			if not serializer.is_valid():
				errors = serializer.errors
				return JsonResponse({"message": f"failed : serializer is not valid", "errors": errors}, status=400)

			if 'new_email' in serializer.validated_data and serializer.validated_data['new_email'] is not None and serializer.validated_data['new_email'] != "":
				CustomUser.set_email(user, serializer.validated_data['new_email'])

			if 'new_alias' in serializer.validated_data and serializer.validated_data['new_alias'] is not '':
				CustomUser.set_alias(user, serializer.validated_data['new_alias'])

			if 'new_pp' in serializer.validated_data and serializer.validated_data['new_pp'] is not None:
				base64_str = serializer.validated_data['new_pp']
				if base64_str.startswith("data:image"):
					base64_str = base64_str.split(",")[1]

				image_data = base64.b64decode(base64_str)
				random_number = random.randint(0, 10000000)
				file_name = f"img/avatar/new_pp_{user.username}{random_number}.png"
				file_path = Path(settings.NGINX_STATIC_ROOT) / file_name
				old_path = Path(settings.NGINX_STATIC_ROOT) / user.avatar_path
				if user.avatar_path != 'img/default_pp.jpg' and old_path.exists():
					old_path.unlink()
				file_path.parent.mkdir(parents=True, exist_ok=True)
				with open(file_path, "wb") as image_file:
					image_file.write(image_data)

				image = ContentFile(image_data, name=file_name)
				user.avatar.delete()
				user.avatar = image
				user.avatar_path = file_name
				user.is_42_pp = False
				user.save()

			if 'new_password' in serializer.validated_data and serializer.validated_data['new_password'] is not '':
				new_password = serializer.validated_data['new_password']
				CustomUser.set_new_password(user, new_password)

			return JsonResponse({"message": "Success",
								 "alias": user.alias,
								 "email": user.email,
								 "profile_picture": user.avatar_path,
								"access_token": encoded_access_jwt})

		except ValidationError as e:
			JsonResponse({"message": f"failed : {e.messages}"}, status=400)
		except BadPasswordError as e:
			JsonResponse({"message": f"failed : {e.messages}"}, status=401)
		except ConfirmationError as e:
			JsonResponse({"message": f"failed : {e.messages}"}, status=401)
		except jwt.InvalidTokenError:
			return JsonResponse({"message": "failed : access_token is invalid"}, status=400)
		except jwt.ExpiredSignatureError:
			return JsonResponse({"message": "failed : access_token is expired"}, status=401)

	def get(self, request):
		try:
			authorization_header = request.headers.get('Authorization')
			if authorization_header is None:
				return JsonResponse({"message": "failed : authorization header missing"})
			if not authorization_header.startswith("Bearer "):
				return JsonResponse({'message': 'failed : no access_token in header'})
			encoded_access_jwt = authorization_header.split(" ", 1)[1]
			payload = decodeAccessToken(request, encoded_access_jwt)
			username = payload.get("username")
			user = CustomUser.get_user_by_name(username)
			return JsonResponse({"message": "Success",
								 "username": username,
								 "alias": user.alias,
								 "status": user.status,
								 "email": user.email,
								 "is_42_account": user.is_42_account,
								 "avatar_path": user.avatar_path,
								 "is_42_pp": user.is_42_pp,
								 "access_token": user.access_token,
								 "id": user.id,
								 "room_id": user.room_id,
								"access_token": encoded_access_jwt,
								"is_2FA": user.is_2FA})
		except jwt.InvalidTokenError:
			return JsonResponse({"message": "failed : access_token is invalid"}, status=400)
		except jwt.ExpiredSignatureError:
			return JsonResponse({"message": "failed : access_token is expired"}, status=401)



class	UserInfoId(APIView):
	def put(self, request, id):
		serializer = ChangeRoomSerializer(data=request.data)
		if not serializer.is_valid():
			errors = serializer.errors
			return JsonResponse({"message": f"failed : serializer is not valid", "errors": errors}, status=400)
		user = CustomUser.get_user_by_id(id=id)
		if user is None:
			return JsonResponse({"message": "failed : User not found"})
		user.room_id = serializer.validated_data['room_id']
		return JsonResponse({"message": "Success",
							"room_id": user.room_id})

	def get(self, id):
		user = CustomUser.get_user_by_id(id=id)
		if user is None:
			return JsonResponse({"message": "failed : User not found"})
		return JsonResponse({"message": "Success",
								 "username": user.username,
								 "alias": user.alias,
								 "status": user.status,
								 "email": user.email,
								 "is_42_account": user.is_42_account,
								 "avatar_path": user.avatar_path,
								 "is_42_pp": user.is_42_pp,
								 "id": user.id,
								 "room_id": user.room_id})


class	UserInfoUsername(APIView):
	def put(self, request, username):
		serializer = ChangeRoomSerializer(data=request.data)
		if not serializer.is_valid():
			errors = serializer.errors
			return JsonResponse({"message": f"failed : serializer is not valid", "errors": errors}, status=400)
		user = CustomUser.get_user_by_name(username=username)
		if user is None:
			return JsonResponse({"message": "failed : User not found"})
		user.room_id = serializer.validated_data['room_id']
		return JsonResponse({"message": "Success",
							"room_id": user.room_id})

	def get(self, username):
		user = CustomUser.get_user_by_name(username=username)
		if user is None:
			return JsonResponse({"message": "failed : User not found"})
		return JsonResponse({"message": "Success",
								 "username": user.username,
								 "alias": user.alias,
								 "status": user.status,
								 "email": user.email,
								 "is_42_account": user.is_42_account,
								 "avatar_path": user.avatar_path,
								 "is_42_pp": user.is_42_pp,
								 "id": user.id,
								 "room_id": user.room_id})

'''
ConfirmToken verify that the response is ok and then create or connect the user with all informations and create JWT token.
On failure return JsonResponse with failed message an explanation. On success return JsonResponse with access token and refresh token as cookie.
'''

class ConfirmToken(APIView):
    def post(self, request):
        serializer = CodeSerializer(data=request.data)
        if not serializer.is_valid():
            return JsonResponse({'message': "failed serializer is not valid"})
        code = serializer.validated_data['code']
        token_url = 'https://api.intra.42.fr/oauth/token'
        client_id = os.getenv('CLIENT_ID')
        client_secret = os.getenv('CLIENT_SECRET')
        redirect_uri = 'https://localhost:8443'
        params = {
            'grant_type': 'authorization_code',
            'client_id': client_id,
            'client_secret': client_secret,
            'code': code,
            'redirect_uri': redirect_uri
        }
        response = requests.post(token_url, data=params)
        if not response.ok:
            return JsonResponse({'code': code, 'client id' : client_id, 'client secret' : client_secret})
        access_token = response.json()['access_token']
        response = requests.get('https://api.intra.42.fr/v2/me', headers={'Authorization': f'Bearer {access_token}'}).json()
        username = response['login']
        CustomUser.add_user(username=username, avatar_path=response['image']['versions']['small'], avatar=response['image']['versions']['small'], tournament_id=None, email=response['email'])
        encoded_access_jwt = CreateAccessToken(request, username)
        CreateRefreshToken(request, username)
        return JsonResponse({"message": "Success", "access_token": encoded_access_jwt})


'''
refresh. Get the refresh token and if it's valid. Generate a new access_token. On success return JsonResponse with success message and new_access_token.
On failure return JsonResponse with failed message and status
'''


class refresh(APIView):
	def get(request):
		try:
			encoded_refresh_jwt = get_cookie_refresh(request)
			payload = decodeRefreshToken(encoded_refresh_jwt)
			username = payload.get("username")
			checkRefreshToken(encoded_refresh_jwt, username)
			new_access_jwt = CreateAccessToken(request, username)
			return JsonResponse({"message": "Success", "access_token": new_access_jwt})
		except jwt.ExpiredSignatureError:
			return JsonResponse({"message": "failed : Refresh token has expired"}, status=401)
		except jwt.InvalidTokenError:
			return JsonResponse({"message": "failed : Refresh token is invalid"}, status=400)

class MatchHistory(APIView):
	def get(self, request):
		try:
			authorization_header = request.headers.get('Authorization')
			if authorization_header is None:
				return JsonResponse({"message": "failed : authorization header missing"})
			if not authorization_header.startswith("Bearer "):
				return JsonResponse({'message': 'failed : no access token in header'})
			encoded_access_jwt = authorization_header.split(" ", 1)[1]
			payload = decodeAccessToken(request, encoded_access_jwt)
			user_id = payload.get("id")
			user = CustomUser.get_user_by_id(user_id)
			user_matches = user.match_history.all()
			matches_data = list(user_matches.values("user_id", "opponent_id", "status", "user_score", "opponent_score", "date"))
			response = {
				"message": "Success",
				"matches": matches_data
			}
			matches_json = json.dumps(response, cls=DjangoJSONEncoder)
			return JsonResponse(matches_json)
		except jwt.InvalidTokenError:
			return JsonResponse({"message": "failed : access_token is invalid"}, status=400)
		except jwt.ExpiredSignatureError:
			return JsonResponse({"message": "failed : access_token is expired"}, status=401)

	def put(self, request):
		serializer = AddMatchSerializer(data=request.data)
		if not serializer.is_valid():
			errors = serializer.errors
			return JsonResponse({"message": f"failed : serializer is not valid", "errors": errors}, status=400)
		try:
			authorization_header = request.headers.get('Authorization')
			if authorization_header is None:
				return JsonResponse({"message": "failed : authorization header missing"})
			if not authorization_header.startswith("Bearer "):
				return JsonResponse({'message': 'failed : no access token in header'})
			encoded_access_jwt = authorization_header.split(" ", 1)[1]
			payload = decodeAccessToken(request, encoded_access_jwt)
			user_id = payload.get("id")
			user1 = CustomUser.get_user_by_id(user_id)
			user2_id = serializer.validated_data['user2_id']
			user2 = CustomUser.get_user_by_id(user2_id)
			if user2 is None :
				return JsonResponse({"message": "failed : User not found"})
			Match.create_match(user1=user1, user2=user2, date=serializer.validated_data['date'], user1_score=serializer.validated_data['user1_score'], user2_score=serializer.validated_data['user2_score'], user1_status=serializer.validated_data['user1_status'], user2_status=serializer.validated_data['user2_status'])
			return JsonResponse({"message": "Success"})
		except jwt.InvalidTokenError:
			return JsonResponse({"message": "failed : access_token is invalid"}, status=400)
		except jwt.ExpiredSignatureError:
			return JsonResponse({"message": "failed : access_token is expired"}, status=401)


class MatchHistoryId(APIView):
	def get(self, request, id):
		user = CustomUser.get_user_by_id(id)
		if user is None:
			return JsonResponse({"message": "failed : User not found"})
		user_matches = user.match_history.all()
		matches_data = list(user_matches.values("user_id", "opponent_id", "status", "user_score", "opponent_score", "date"))
		response = {
			"message": "Success",
			"matches": matches_data
		}
		matches_json = json.dumps(response, cls=DjangoJSONEncoder)
		return JsonResponse(matches_json)

	def put(self, request, id):
		serializer = AddMatchSerializer(data=request.data)
		if not serializer.is_valid():
			errors = serializer.errors
			return JsonResponse({"message": f"failed : serializer is not valid", "errors": errors}, status=400)
		user1 = CustomUser.get_user_by_id(id)
		user2_id = serializer.validated_data['user2_id']
		user2 = CustomUser.get_user_by_id(user2_id)
		if user1 is None or user2 is None:
			return JsonResponse({"message": "failed : User not found"})
		Match.create_match(user1=user1, user2=user2, date=serializer.validated_data['date'], user1_score=serializer.validated_data['user1_score'], user2_score=serializer.validated_data['user2_score'], user1_status=serializer.validated_data['user1_status'], user2_status=serializer.validated_data['user2_status'])
		return JsonResponse({"message": "Success"})

class MatchHistoryUsername(APIView):
	def get(self, username):
		user = CustomUser.get_user_by_name(username)
		if user is None:
			return JsonResponse({"message": "failed : User not found"})
		user_matches = user.match_history.all()
		matches_data = list(user_matches.values("user_id", "opponent_id", "status", "user_score", "opponent_score", "date"))
		response = {
			"message": "Success",
			"matches": matches_data
		}
		matches_json = json.dumps(response, cls=DjangoJSONEncoder)
		return JsonResponse(matches_json)

	def put(self, request, username):
		serializer = AddMatchSerializer(data=request.data)
		if not serializer.is_valid():
			errors = serializer.errors
			return JsonResponse({"message": f"failed : serializer is not valid", "errors": errors}, status=400)
		user1 = CustomUser.get_user_by_username(username)
		user2_id = serializer.validated_data['user2_id']
		user2 = CustomUser.get_user_by_id(user2_id)
		if user1 is None or user2 is None:
			return JsonResponse({"message": "failed : User not found"})
		Match.create_match(user1=user1, user2=user2, date=serializer.validated_data['date'], user1_score=serializer.validated_data['user1_score'], user2_score=serializer.validated_data['user2_score'], user1_status=serializer.validated_data['user1_status'], user2_status=serializer.validated_data['user2_status'])
		return JsonResponse({"message": "Success"})

class	UserStat(APIView):
	def get(self, request):
		try:
			authorization_header = request.headers.get('Authorization')
			if authorization_header is None:
				return JsonResponse({"message": "failed : authorization header missing"})
			if not authorization_header.startswith("Bearer "):
				return JsonResponse({'message': 'failed : no access token in header'})
			encoded_access_jwt = authorization_header.split(" ", 1)[1]
			payload = decodeAccessToken(request, encoded_access_jwt)
			user_id = payload.get("id")
			user = CustomUser.get_user_by_id(user_id)
			return JsonResponse({"message": "Success",
								"matches_number": user.matches_number,
								"matches_win": user.matches_win,
								"matches_lose": user.matches_lose,
								"winrate": user.winrate,
								"goal_scored": user.goal_scored,
								"goal_conceded": user.goal_conceded})
		except jwt.InvalidTokenError:
			return JsonResponse({"message": "failed : access_token is invalid"}, status=400)
		except jwt.ExpiredSignatureError:
			return JsonResponse({"message": "failed : access_token is expired"}, status=401)

class	UserStatId(APIView):
	def get(self, id):
		user = CustomUser.get_user_by_id(id)
		if user is None:
			return JsonResponse({"message": "failed : User not found"})
		return JsonResponse({"message": "Success",
							"matches_number": user.matches_number,
							"matches_win": user.matches_win,
							"matches_lose": user.matches_lose,
							"winrate": user.winrate,
							"goal_scored": user.goal_scored,
							"goal_conceded": user.goal_conceded})

class	UserStatUsername(APIView):
	def get(self, username):
		user = CustomUser.get_user_by_name(username)
		if user is None:
			return JsonResponse({"message": "failed : User not found"})
		return JsonResponse({"message": "Success",
							"matches_number": user.matches_number,
							"matches_win": user.matches_win,
							"matches_lose": user.matches_lose,
							"winrate": user.winrate,
							"goal_scored": user.goal_scored,
							"goal_conceded": user.goal_conceded})

class Api42(APIView):
	def get(self, request):
		access_token = request.session.get('access_token')
		if not access_token:
			return JsonResponse({'message': 'failed : access token not found'}, status=400)
		return JsonResponse({'message': 'Success', 'access_token': access_token})


class Activate2FA(APIView):
	def get(self, request):
		try:
			authorization_header = request.headers.get('Authorization')
			if authorization_header is None:
				return JsonResponse({"message": "failed : authorization header missing"})
			if not authorization_header.startswith("Bearer "):
				return JsonResponse({'message': 'failed no access token in header'})
			encoded_access_jwt = authorization_header.split(" ", 1)[1]
			payload = decodeAccessToken(request, encoded_access_jwt)
			user_id = payload.get("id")
			user = CustomUser.get_user_by_id(user_id)

			upload_dir = Path(settings.NGINX_STATIC_ROOT) / "img/qr_codes/"
			upload_dir.mkdir(parents=True, exist_ok=True)

			file_name = f"qr_{user.username}.png"
			file_path = upload_dir / file_name

			totp_uri = f"otpauth://totp/{user.email}?secret={user.totp}&issuer=Transcendence"
			qr = qrcode.QRCode(box_size=10, border=5)
			qr.add_data(totp_uri)
			qr.make(fit=True)
			img = qr.make_image(fill="black", back_color="white")

			with open(file_path, "wb") as image_file:
				img.save(image_file)

			user.qrcode_path = "img/qr_codes/" + file_name
			user.save()

			return JsonResponse({'message': 'Success', 'qrcode_path': user.qrcode_path})

		except jwt.InvalidTokenError:
			return JsonResponse({"message": "failed : access_token is invalid"}, status=400)
		except jwt.ExpiredSignatureError:
			return JsonResponse({"message": "failed : access_token is expired"}, status=401)

	def post(self, request):
		try:
			authorization_header = request.headers.get('Authorization')
			if authorization_header is None:
				return JsonResponse({"message": "failed : authorization header missing"})
			if not authorization_header.startswith("Bearer "):
				return JsonResponse({'message': 'failed : no access_token in header'})
			encoded_access_jwt = authorization_header.split(" ", 1)[1]
			payload = decodeAccessToken(request, encoded_access_jwt)
			username = payload.get("username")
			user = CustomUser.get_user_by_name(username)
			serializer = Serializer2FA(data=request.data)
			if not serializer.is_valid():
				return JsonResponse({'message': 'failed : serializer is not valid'})
			otp_code = serializer.validated_data['otp_code']
			totp = pyotp.TOTP(user.totp)

			if totp.verify(otp_code):
				user.is_2FA = True
				user.save()
				return JsonResponse({'message': 'Success'})

			else:
				return JsonResponse({'message': 'failed : wrong 2FA code'})

		except jwt.InvalidTokenError:
			return JsonResponse({"message": "failed : access_token is invalid"}, status=400)
		except jwt.ExpiredSignatureError:
			return JsonResponse({"message": "failed : access_token is expired"}, status=401)

class Verify2FA(APIView):
	def post(self, request):
		try:
			authorization_header = request.headers.get('Authorization')
			if authorization_header is None:
				return JsonResponse({"message": "failed : authorization header missing"})
			if not authorization_header.startswith("Bearer "):
				return JsonResponse({'message': 'failed : no access_token in header'})
			encoded_access_jwt = authorization_header.split(" ", 1)[1]
			payload = decodeAccessToken(request, encoded_access_jwt)
			username = payload.get("username")
			user = CustomUser.get_user_by_name(username)
			serializer = Serializer2FA(data=request.data)
			if not serializer.is_valid():
				error = serializer.errors
				return JsonResponse({'message': 'failed : serializer is not valid', 'errors': error})
			otp_code = serializer.validated_data['otp_code']
			totp = pyotp.TOTP(user.totp)

			if totp.verify(otp_code):
				return JsonResponse({'message': 'Success'})

			else:
				return JsonResponse({'message': 'failed : wrong 2FA code'}, status=401)

		except jwt.InvalidTokenError:
			return JsonResponse({"message": "failed : access_token is invalid"}, status=400)
		except jwt.ExpiredSignatureError:
			return JsonResponse({"message": "failed : access_token is expired"}, status=401)

class Desactivate2FA(APIView):
	def put(self, request):
		try:
			authorization_header = request.headers.get('Authorization')
			if authorization_header is None:
				return JsonResponse({"message": "failed : authorization header missing"})
			if not authorization_header.startswith("Bearer "):
				return JsonResponse({'message': 'failed : no access_token in header'})
			encoded_access_jwt = authorization_header.split(" ", 1)[1]
			payload = decodeAccessToken(request, encoded_access_jwt)
			username = payload.get("username")
			user = CustomUser.get_user_by_name(username)

			user.is_2FA = False
			user.save()
			return JsonResponse({'message': 'Success'})

		except jwt.InvalidTokenError:
			return JsonResponse({"message": "failed : access_token is invalid"}, status=400)
		except jwt.ExpiredSignatureError:
			return JsonResponse({"message": "failed : access_token is expired"}, status=401)