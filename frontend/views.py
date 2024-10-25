import string
from fileinput import filename
from http.client import responses
from operator import indexOf
from os import access
from tempfile import NamedTemporaryFile
from urllib.parse import uses_relative

from aiohttp import payload_type
from django.contrib.auth import login, authenticate
from django.template.context_processors import request
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
import requests
import  os

from django.template.smartif import infix
from django.views.decorators.csrf import csrf_exempt

from db import models
from db.models import CustomUser
from db.models import Tournament
from login.forms import CustomUserCreationForm, LoginForm
from django.contrib.auth.decorators import login_required
from . import forms
from .forms import changeAliasForm, changePpForm, changeEmailForm, changePasswordForm
from django.core.files.storage import FileSystemStorage
from django.conf import settings


# Create your views here.
def index(request):
	return render(request, "frontend/index.html")

def get_user_info(request):
	# print(request.session, flush=True)
	# print(request.session.keys())
	if "user_info" not in request.session:
		return JsonResponse({"error": "Not logged in"})
	info = request.session["user_info"]
	if info:
		username = info.get('login', 'login not found')
		user = CustomUser.get_user_by_name(username)
		if user.is_42_pp == True:
			payload = {'login': username, 'alias': user.alias, 'image': user.avatar_path, 'email': user.email}
		else:
			payload = {'login': username, 'alias': user.alias, 'image': user.avatar.url, 'email': user.email}
		request.session['user_info'] = payload
	return JsonResponse(request.session["user_info"])

def room_join(request, room_code):
	return HttpResponse(f"Joining room {room_code}.")

def friend_add(request, username):
	return HttpResponse(f"Sending friend request to {username}.")

# def login(request):
# 	return HttpResponse(f"test")

def confirm_token(request):
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
	print(response.json())
	if response.ok:
		access_token = response.json()['access_token']
		response = requests.get('https://api.intra.42.fr/v2/me', headers={'Authorization': f'Bearer {access_token}'}).json()
		payload = {"login": response['login'], "image": response['image']['versions']['small'], "email": response['email']}
		request.session['user_info'] = payload
		username = response['login']
		CustomUser.add_user(username=username, avatar_path=response['image']['versions']['small'], avatar=response['image']['versions']['small'], tournament_id=None, email=response['email'])
		return redirect('/')
	else:
		return redirect('/')

def download_pp(request, image_url):
	response = requests.get(image_url)

	if response.status_code == 200:
		img_temp = NamedTemporaryFile(delete=True)
		img_temp.write(response.content)
		img_temp.flush()
		image_name = os.path.basename(image_url)
		image_path = os.path.join(settings.BASE_DIR, 'static/frontend/', image_name)

		with open(image_path, 'wb') as f:
			f.write(img_temp.read())
		return image_path

def settings_page(request):
	info = request.session['user_info']
	username = info.get('login')
	user = CustomUser.get_user_by_name(username)
	if user.is_42_account == False:
		return render(request, "frontend/settings_page.html")
	else:
		return render(request, "frontend/settings42.html")
def changeAlias(request):
	if request.method == 'POST':
		form = changeAliasForm(request.POST)
		if form.is_valid():
			info = request.session['user_info']
			username = info.get('login')
			user = CustomUser.get_user_by_name(username)
			CustomUser.set_alias(user, new_alias=form.get_alias())
			return redirect('/settings_page')
	else:
		form = changeAliasForm()
	return render(request, 'frontend/changeAlias.html', {'form': form})

def changePP(request):
	if request.method == 'POST':
		form = changePpForm(request.POST, request.FILES)
		if form.is_valid():
			image = form.cleaned_data['new_PP']
			fs = FileSystemStorage(location=os.path.join(settings.BASE_DIR, 'static/frontend/'))
			filename = fs.save(image.name, image)
			info = request.session['user_info']
			username = info.get('login')
			user = CustomUser.get_user_by_name(username)
			full_path = os.path.join('static/frontend/', filename)
			CustomUser.set_image(user, full_path);
			user.is_42_pp = False;
			return redirect('/settings_page')
	else:
		form = changePpForm()
	return render(request, 'frontend/changePP.html', {'form' : form})

def changeEmail(request):
	if request.method == 'POST':
		form = changeEmailForm(request.POST)
		if form.is_valid():
			newEmail = form.getEmail()
			info = request.session['user_info']
			username = info.get('login')
			user = CustomUser.get_user_by_name(username)
			CustomUser.set_email(user, newEmail)
			return redirect('/settings_page')
	else:
		form = changeEmailForm()
	return render(request, 'frontend/changeEmail.html', {'form': form})

def changePassword(request):
	if request.method == 'POST':
		form = changePasswordForm(request.POST)
		if form.is_valid():
			info = request.session['user_info']
			username = info.get('login')
			user = CustomUser.get_user_by_name(username)
			old_password = form.getOldPassword()
			new_password = form.getNewPassword()
			confrimation = form.getConfirmation()
			if old_password != user.password:
				return render(request, 'frontend/changePassword.html', {'form' : form, 'error': 'Old Password is wrong'})
			if new_password != confrimation:
				return render(request, 'frontend/changePassword.html', {'form' : form, 'error': 'Confirm password and password need to match'})
			user.password = new_password
			user.save()
			return redirect('/settings_page')
	else:
		form = changePasswordForm()
	return render(request, 'frontend/changePassword.html', {'form' : form})