from cgitb import reset
from csv import excel
from fileinput import filename
from http.client import responses
from django.contrib.auth import login, authenticate
from django.db.models.fields import return_None
from django.views.decorators.csrf import csrf_exempt
from jwt import InvalidTokenError, ExpiredSignatureError
from rest_framework.exceptions import ValidationError
from .forms import  BadPasswordError, ConfirmationError
from django.contrib.auth.decorators import login_required
import jwt
from tempfile import NamedTemporaryFile
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
import requests
import  os
from .models import CustomUser
from django.core.files.storage import FileSystemStorage
from django.conf import settings
from datetime import datetime, timedelta
from .serializers import RegisterSerializer, LoginSerializer, EditAccountSerializer

"""
register take a POST request of the CustomUserSerializer. The function verify that all fields are valid
and then create the user in DB and create too JWT token for this user. On success return a success message with the encoded_access_jwt and the encoded_refresh_jwt
is send as cookie. On failure return a failed message with an explanation and status
"""
def register(APIView):
	def post(self, request):
		serializer = RegisterSerializer(data=request.data)
		if not serializer.is_valid():
			return JsonResponse({"message": "failed : serializer is not valid"}, status=400)
		try:
			username = serializer.validate_username()
			email = serializer.validate_email()
			password = serializer.validate()
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

def loginAPI(APIView):
	def post(self, request):
		serializer = LoginSerializer(data=request.data)
		if not serializer.is_valid():
			return JsonResponse({"message": "failed : serializer is not valid"}, status=400)
		username = serializer.validated_data['username']
		password = serializer.validated_data['password']
		user = CustomUser.get_user_by_name(username)
		if user.password != password:
			return JsonResponse({"message": f"failed : authentication failed for {username}"}, status=401)
		encoded_access_jwt = CreateAccessToken(request, username)
		CreateRefreshToken(request, username)
		return JsonResponse({"message": "success", "access_token": encoded_access_jwt})

'''
EditAccount take a POST request of EditAccountSerializer and the encoded_access_jwt. The function check all field of serializer and change in DB if fields aren't empty and if fields are valid
On success return JsonResponse with success message and all info for this user. On failure return JsonResponse with failed message, explanation and status code.
'''

def EditAccount(request, encoded_access_jwt):
	def post(self, request):
		serializer = EditAccountSerializer(data=request.data)
		if not serializer.is_valid():
			return JsonResponse({"message": "failed : form is not valid"}, status=400)
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

'''
get42_response take a request with a code. This code will be use to request a response at 42's API. Return this response
'''

def get42_response(request):
	code = request.GET.get('code')
	token_url = 'https://api.intra.42.fr/oauth/token'
	client_id = os.getenv('CLIENT_ID')
	client_secret = os.getenv('CLIENT_SECRET')
	redirect_uri = 'http://localhost:8000/confirm_token'
	params = {
		'grant_type': 'authorization_code',
		'client_id': client_id,
		'client_secret': client_secret,
		'code': code,
		'redirect_uri': redirect_uri
	}
	response = requests.post(token_url, data=params)
	return response

'''
confirm_token verify that the response is ok and then create or connect the user with all informations and create JWT token.
On failure return JsonResponse with failed message an explanation. On success return JsonResponse with access token and refresh token as cookie.
'''

def confirm_token(request):
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
get_user_info take an encoded_access_token. On success return a JsonResponse with success message and all information of a user. On failure return a JsonResponse with failed message
'''

def get_user_info(request, encoded_access_jwt):
	try:
		payload = decodeAccessToken(request, encoded_access_jwt)
		username = payload.get("username")
		user = CustomUser.get_user_by_id(username)
		return JsonResponse({"message": "Success",
							 "username": username,
							 "alias": user.alias,
							 "status": user.status,
							 "email": user.email,
							 "is_42_account": user.is_42_account,
							 "avatar_path": user.avatar_path,
							 "is_42_pp": user.is_42_pp,
							 "access_token": user.access_token})
	except jwt.InvalidTokenError:
		return JsonResponse({"message": "failed : access_token is invalid"}, status=400)
	except jwt.ExpiredSignatureError:
		return JsonResponse({"message": "failed : access_token is expired"}, status=401)

'''
CreateAccessToken take an username. Create, stock in DB and return an encoded_access_token
'''

def CreateAccessToken(request, username):
	user = CustomUser.get_user_by_name(username)
	exp_access = datetime.now() + timedelta(hours=5)
	iat = datetime.now()
	payload = {
		"username": username,
		"user_id": user.id,
		"exp": int(exp_access.timestamp()),
		"iat": int(iat.timestamp())
	}
	encoded_access_jwt = jwt.encode(payload, os.getenv('JWT_ACCESS_KEY'), algorithm="HS256")
	return encoded_access_jwt

'''
CreateRefreshToken take an username. Create and set as cookie an encoded_refresh_token
'''

def CreateRefreshToken(request, username):
	user = CustomUser.get_user_by_name(username)
	exp_refresh = datetime.now() + timedelta(days=7)
	iat = datetime.now()
	payload = {
		"username": username,
		"user_id": user.id,
		"exp": int(exp_refresh.timestamp()),
		"iat": int(iat.timestamp())
	}
	encoded_refresh_jwt = jwt.encode(payload, os.getenv('JWT_REFRESH_KEY'), algorithm="HS256")
	user.set_refresh_token(user, encoded_refresh_jwt)
	user.save()
	response = HttpResponse("Cookie has been set")
	response.set_cookie('refresh_token', encoded_refresh_jwt, max_age=604800)

'''
get_cookie_refresh Get and return the encoded_refresh_token
'''

def get_cookie_refresh(request):
	value = request.COOKIES.get('refresh_token')
	return value

'''
refresh. Get the refresh token and if it's valid. Generate a new access_token. On success return JsonResponse with success message and new_access_token.
On failure return JsonResponse with failed message and status
'''

def checkRefreshToken(encoded_refresh_token, username):
	user = CustomUser.get_user_by_name(username)
	if user.refresh_token is not encoded_refresh_token:
		raise InvalidTokenError

def refresh(request):
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

'''
decodeAccessToken take an access_token. Check if access token is valid and not expire and return the payload with information.
On failure raise exception with custom message
'''

def decodeAccessToken(request, encoded_jwt):
	try:
		payload = jwt.decode(encoded_jwt, os.getenv('JWT_SECRET_KEY'), algorithms=["HS256"])
		return payload
	except jwt.ExpiredSignatureError:
		raise ExpiredSignatureError
	except jwt.InvalidTokenError:
		raise InvalidTokenError

'''
decodeRefreshToken take a refresh_token. Check if access token is valid and not expire and return the payload with information.
On failure raise exception with custom message
'''

def decodeRefreshToken(encoded_jwt):
	try:
		payload = jwt.decode(encoded_jwt, os.getenv('JWT_SECRET_KEY'), algorithms=["HS256"])
		return payload
	except jwt.ExpiredSignatureError:
		raise ExpiredSignatureError
	except jwt.InvalidTokenError:
		raise InvalidTokenError
