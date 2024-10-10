import string
from http.client import responses
from os import access
from urllib.parse import uses_relative
from django.contrib.auth import login
from django.template.context_processors import request
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
import requests
import  os
from db import models
from db.models import User
from db.models import Tournament


# Index take the request and just return the render of an index page.

def index(request):
	return render(request, "game/index.html")

# Succes take the request. In request's url we can find a code. This code will be used to connect the user to his intra's account.
# Then he will be redirect to the confirm_token page and we will get his login and his profile picture

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
		User.add_user(name=username, status=None, avatar=response['image']['versions']['small'], tournament_id=None)
		
		return redirect('index')
	else:
		return redirect('index')