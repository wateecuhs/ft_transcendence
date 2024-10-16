import string
from http.client import responses
from os import access
from urllib.parse import uses_relative
from django.contrib.auth import login, authenticate
from django.template.context_processors import request
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
import requests
import  os

from django.views.decorators.csrf import csrf_exempt

from db import models
from db.models import CustomUser
from db.models import Tournament
from game.forms import CustomUserCreationForm, LoginForm
from django.contrib.auth.decorators import login_required


# Create your views here.
def index(request):
	return render(request, "frontend/index.html")

def get_user_info(request):
	# print(request.session, flush=True)
	# print(request.session.keys())
	if "user_info" not in request.session:
		return JsonResponse({"error": "Not logged in"})
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
		print("coucou")
		access_token = response.json()['access_token']
		response = requests.get('https://api.intra.42.fr/v2/me', headers={'Authorization': f'Bearer {access_token}'}).json()
		payload = {"login": response['login'], "image": response['image']['versions']['small']}
		request.session['user_info'] = payload
		print("Added session data")
		print(type(response['login']))
		username = response['login']
		CustomUser.add_user(name=username, avatar=response['image']['versions']['small'], tournament_id=None)
		return redirect('index')
	else:
		return redirect('index')