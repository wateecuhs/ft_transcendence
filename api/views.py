from cgitb import reset
from csv import excel
from fileinput import filename
from http.client import responses

from django.contrib.auth import login, authenticate
from django.db.models.fields import return_None
from django.views.decorators.csrf import csrf_exempt
from jwt import InvalidTokenError, ExpiredSignatureError
from rest_framework.exceptions import ValidationError

from .forms import CustomUserCreationForm, LoginForm, EmptyFieldError, BadPasswordError, ConfirmationError
from django.contrib.auth.decorators import login_required
import jwt
from tempfile import NamedTemporaryFile
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
import requests
import  os
from db.models import CustomUser
from django.core.files.storage import FileSystemStorage
from django.conf import settings
from datetime import datetime, timedelta
from .forms import EditAccountForm

# Index take the request and just return the render of an index page.

def index(request):
	return render(request, "login/index.html")

# Succes take the request. In request's url we can find a code. This code will be used to connect the user to his intra's account.
# Then he will be redirect to the confirm_token page and we will get his api and his profile picture

@csrf_exempt
def register(request, form):
	if request.method == 'POST':
		form = CustomUserCreationForm(request.POST)
		if not form.is_valid():
			return JsonResponse({"message": "failed : form is not valid"}, status=400)
		try:
			form.validate_username()
			form.validate_email()
			form.validate_password()
			CustomUser.add_user_by_form(username=form.username, password=form.password, email=form.email, avatar='static/default_pp.png')
			encoded_access_jwt = CreateAccessToken(request, form.username)
			CreateRefreshToken(request, form.username)
			return JsonResponse({"message": "success", "access_token": encoded_access_jwt})
		except ValidationError as e:
			return JsonResponse({"message": f"failed : {e.messages}"}, status=401)

@csrf_exempt
def loginAPI(request):
	if request.method == 'POST':
		form = LoginForm(request.POST)
		if not form.is_valid():
			return JsonResponse({"message": "failed : form is not valid"}, status=400)
		username = form.cleaned_data['username']
		password = form.cleaned_data['password']
		user = CustomUser.get_user_by_name(username)
		if user.password != password:
			return JsonResponse({"message": f"failed : authentication failed for {username}"}, status=401)
		login(request, user)
		encoded_access_jwt = CreateAccessToken(request, username)
		CreateRefreshToken(request, username)
		return JsonResponse({"message": "success", "access_token": encoded_access_jwt})


def EditAccount(request, encoded_access_jwt):
	if request.method == "POST":
		form = EditAccountForm(request.POST)
		if not form.is_valid():
			return JsonResponse({"message": "failed : form is not valid"}, status=400)
		try:
			payload = decodeAccessToken(request, encoded_access_jwt)
			username = payload.get("username")
			user = CustomUser.get_user_by_name(username)
			if form.new_email is not None:
				CustomUser.set_email(user, form.new_email)
			if form.new_alias is not '':
				CustomUser.set_alias(user, form.new_alias)
			if form.new_pp is not None:
				image = form.cleaned_data['new_pp']
				fs = FileSystemStorage(location=os.path.join(settings.BASE_DIR, 'static/frontend/'))
				filename = fs.save(image.name, image)
				full_path = os.path.join('static/frontend/', filename)
				CustomUser.set_image(user, full_path)
				user.is_42_pp = False
			if form.new_password is not '':
				new_password = form.validePassword(user=user)
				CustomUser.set_password(user, new_password)
			return JsonResponse({"message": "Success",
								 "alias": user.alias,
								 "email": user.email,
								 "profile_picture": user.avatar_path})
		except EmptyFieldError as e:
			JsonResponse({"message": f"failed : {e.messages}"}, status=400)
		except BadPasswordError as e:
			JsonResponse({"message": f"failed : {e.messages}"}, status=401)
		except ConfirmationError as e:
			JsonResponse({"message": f"failed : {e.messages}"}, status=401)
		except jwt.InvalidTokenError:
			return JsonResponse({"message": "failed : access_token is invalid"}, status=400)
		except jwt.ExpiredSignatureError:
			return JsonResponse({"message": "failed : access_token is expired"}, status=401)

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

def confirm_token(request):
	response = get42_response(request)
	if not response.ok:
		return JsonResponse({"message_error": "Failed to access at 42's API"}, status=401)
	access_token = response.json()['access_token']
	response = requests.get('https://api.intra.42.fr/v2/me', headers={'Authorization': f'Bearer {access_token}'}).json()
	payload = {"login": response['login'], "image": response['image']['versions']['small'], "email": response['email']}
	request.session['user_info'] = payload
	username = response['login']
	CustomUser.add_user(username=username, avatar_path=response['image']['versions']['small'], avatar=response['image']['versions']['small'], tournament_id=None, email=response['email'])
	encoded_access_jwt = CreateAccessToken(request, username)
	CreateRefreshToken(request, username)
	return JsonResponse({"access_token": encoded_access_jwt})

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
	encoded_access_jwt = jwt.encode(payload, os.getenv('JWT_SECRET_KEY'), algorithm="HS256")
	user.set_access_token(user, encoded_access_jwt)
	user.save()
	return encoded_access_jwt

def CreateRefreshToken(request, username)
	user = CustomUser.get_user_by_name(username)
	exp_refresh = datetime.now() + timedelta(days=7)
	iat = datetime.now()
	payload = {
		"username": username,
		"user_id": user.id,
		"exp": int(exp_refresh.timestamp()),
		"iat": int(iat.timestamp())
	}
	encoded_refresh_jwt = jwt.encode(payload, os.getenv('JWT_SECRET_KEY'), algorithm="HS256")
	user.set_refresh_token(user, encoded_refresh_jwt)
	user.save()
	response = HttpResponse("Cookie has been set")
	response.set_cookie('refresh_token', encoded_refresh_jwt, max_age=604800)

def get_cookie_refresh(request):
	value = request.COOKIES.get('refresh_token')
	return value

def refresh(request):
	try:
		encoded_refresh_jwt = get_cookie_refresh(request)
		payload = decodeRefreshToken(encoded_refresh_jwt)
		username = payload.get("username")
		new_access_jwt = CreateAccessToken(request, username)
		return JsonResponse({"message": "Success", "access_token": new_access_jwt})
	except ExpiredSignatureError:
		return JsonResponse({"message": "failed : Refresh token has expired"}, status=401)
	except InvalidTokenError:
		return JsonResponse({"message": "failed : Refresh token is invalid"}, status=400)


def decodeAccessToken(request, encoded_jwt):
	try:
		payload = jwt.decode(encoded_jwt, os.getenv('JWT_SECRET_KEY'), algorithms=["HS256"])
		return payload
	except jwt.ExpiredSignatureError:
		raise ExpiredSignatureError
	except jwt.InvalidTokenError:
		raise InvalidTokenError

def decodeRefreshToken(encoded_jwt):
	try:
		payload = jwt.decode(encoded_jwt, os.getenv('JWT_SECRET_KEY'), algorithms=["HS256"])
		return payload
	except jwt.ExpiredSignatureError:
		raise ExpiredSignatureError
	except jwt.InvalidTokenError:
		raise InvalidTokenError