from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.request import Request
import jwt, os, requests
from jwt import InvalidTokenError, ExpiredSignatureError
from django.http import JsonResponse
from django.core.files.storage import FileSystemStorage
from django.conf import settings
from .forms import  BadPasswordError, ConfirmationError
from .models import CustomUser
from .serializers import RegisterSerializer, LoginSerializer, EditAccountSerializer, ChangeRoomSerializer
from .utils import get42_response, get_cookie_refresh, checkRefreshToken, CreateAccessToken, CreateRefreshToken, decodeAccessToken, decodeRefreshToken

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
			CustomUser.add_user_by_form(username=username, password=password, email=email, avatar='static/default_pp.png')
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
		if not user or user.password != password:
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
	def put(self, request, encoded_access_jwt):
		serializer = EditAccountSerializer(data=request.data)
		if not serializer.is_valid():
			errors = serializer.errors
			return JsonResponse({"message": f"failed : serializer is not valid", "errors": errors}, status=400)
		try:
			payload = decodeAccessToken(request, encoded_access_jwt)
			username = payload.get("username")
			user = CustomUser.get_user_by_name(username)
			if serializer.validated_data['new_email'] is not None:
				CustomUser.set_email(user, serializer.validated_data['new_email'])
			if serializer.validated_data['new_alias'] is not '':
				CustomUser.set_alias(user, serializer.validated_data['new_alias'])
			if serializer.validated_data['new_pp'] is not None:
				image = serializer.validated_data['new_pp']
				fs = FileSystemStorage(location=os.path.join(settings.BASE_DIR, 'static/frontend/'))
				file_path = os.path.join('static/frontend/', image.name)
				if fs.exists(file_path):
					full_path = file_path
				else:
					filename = fs.save(image.name, image)
					full_path = os.path.join('static/frontend/', filename)
				CustomUser.set_image(user, full_path)
				user.is_42_pp = False
			if serializer.validated_data['new_password'] is not '':
				new_password = serializer.validate(user=user)
				CustomUser.set_password(user, new_password)
			return JsonResponse({"message": "Success",
								 "alias": user.alias,
								 "email": user.email,
								 "profile_picture": user.avatar_path})
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
			if authorization_header.startswith("Bearer "):
				encoded_access_jwt = authorization_header.split(" ", 1)[1]
			print(f'encoded_access_jwt')
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
								 "user_id": user.user_id,
								 "room_id": user.room_id})
		except jwt.InvalidTokenError:
			return JsonResponse({"message": "failed : access_token is invalid"}, status=400)
		except jwt.ExpiredSignatureError:
			return JsonResponse({"message": "failed : access_token is expired"}, status=401)



class	UserInfoId(APIView):
	def put(self, request, user_id):
		serializer = ChangeRoomSerializer(data=request.data)
		if not serializer.is_valid():
			errors = serializer.errors
			return JsonResponse({"message": f"failed : serializer is not valid", "errors": errors}, status=400)
		user = CustomUser.get_user_by_id(user_id=user_id)
		user.room_id = serializer.validated_data['room_id']
		return JsonResponse({"message": "Success",
							"room_id": user.room_id})

	def get(self, user_id):
		user = CustomUser.get_user_by_id(user_id=user_id)
		return JsonResponse({"message": "Success",
								 "username": user.username,
								 "alias": user.alias,
								 "status": user.status,
								 "email": user.email,
								 "is_42_account": user.is_42_account,
								 "avatar_path": user.avatar_path,
								 "is_42_pp": user.is_42_pp,
								 "user_id": user.user_id,
								 "room_id": user.room_id})


class	UserInfoUsername(APIView):
	def put(self, request, username):
		serializer = ChangeRoomSerializer(data=request.data)
		if not serializer.is_valid():
			errors = serializer.errors
			return JsonResponse({"message": f"failed : serializer is not valid", "errors": errors}, status=400)
		user = CustomUser.get_user_by_name(username=username)
		user.room_id = serializer.validated_data['room_id']
		return JsonResponse({"message": "Success",
							"room_id": user.room_id})

	def get(self, username):
		user = CustomUser.get_user_by_name(username=username)
		return JsonResponse({"message": "Success",
								 "username": user.username,
								 "alias": user.alias,
								 "status": user.status,
								 "email": user.email,
								 "is_42_account": user.is_42_account,
								 "avatar_path": user.avatar_path,
								 "is_42_pp": user.is_42_pp,
								 "user_id": user.user_id,
								 "room_id": user.room_id})

'''
ConfirmToken verify that the response is ok and then create or connect the user with all informations and create JWT token.
On failure return JsonResponse with failed message an explanation. On success return JsonResponse with access token and refresh token as cookie.
'''

class ConfirmToken(APIView):
	def get(request):
		response = get42_response(request)
		if not response.ok:
			return JsonResponse({"message_error": "Failed to access at 42's API"}, status=401)
		access_token = response.json()['access_token']
		response = requests.get('https://api.intra.42.fr/v2/me', headers={'Authorization': f'Bearer {access_token}'}).json()
		username = response['login']
		CustomUser.add_user(username=username, avatar_path=response['image']['versions']['small'], avatar=response['image']['versions']['small'], tournament_id=None, email=response['email'])
		encoded_access_jwt = CreateAccessToken(request, username)
		CreateRefreshToken(request, username)
		return JsonResponse({"access_token": encoded_access_jwt})


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
		except ExpiredSignatureError:
			return JsonResponse({"message": "failed : Refresh token has expired"}, status=401)
		except InvalidTokenError:
			return JsonResponse({"message": "failed : Refresh token is invalid"}, status=400)
