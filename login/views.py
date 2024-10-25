import string
from http.client import responses
from os import access
from urllib.parse import uses_relative

from aiohttp import payload_type
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
from .forms import CustomUserCreationForm, LoginForm
from django.contrib.auth.decorators import login_required
from frontend import views


# Index take the request and just return the render of an index page.

def index(request):
	return render(request, "login/index.html")

# Succes take the request. In request's url we can find a code. This code will be used to connect the user to his intra's account.
# Then he will be redirect to the confirm_token page and we will get his login and his profile picture

@csrf_exempt
def register(request):
	if request.method == 'POST':
		form = CustomUserCreationForm(request.POST)
		if form.is_valid():
			CustomUser.add_user_by_form(username=form.get_username(), password=form.get_password(), email=form.get_email(), avatar='static/default_pp.png')
			login(request, user=CustomUser.get_user_by_name(name=form.get_username()))
			return redirect('user_profile')

	else:
		form = CustomUserCreationForm()
	return render(request, 'login/register.html', {'form': form})

@csrf_exempt
def loginview(request):
	if request.method == 'POST':
		form = LoginForm(request.POST)
		if form.is_valid():
			username = form.cleaned_data['username']
			password = form.cleaned_data['password']
			user = CustomUser.get_user_by_name(username)
			if user.password == password:
				print('success')
				login(request, user)
				image_url = request.build_absolute_uri(user.avatar.url) if user.avatar else None
				payload = {
					"login": user.username,
					"image": image_url,
				}
				request.session['user_info'] = payload
				print(user.avatar.url)
				return redirect('frontend:index')
			else:
				print(f"Authentication failed for {username}")
				return render(request, 'login/login.html', {'form': form, 'error': 'Username or Password wrong'})
	else:
		form = LoginForm()
	return render(request, 'login/login.html', {'form': form})

@login_required
def user_profile(request):
    user = request.user
    context = {
        'username': user.username,
        'email': user.email,
        'date_joined': user.date_joined,
    }
    return render(request, 'login/user_profile.html', context)