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
from .forms import CustomUserCreationForm, LoginForm
from django.contrib.auth.decorators import login_required


# Index take the request and just return the render of an index page.

def index(request):
	return render(request, "game/index.html")

# Succes take the request. In request's url we can find a code. This code will be used to connect the user to his intra's account.
# Then he will be redirect to the confirm_token page and we will get his login and his profile picture

@csrf_exempt
def register(request):
	if request.method == 'POST':
		form = CustomUserCreationForm(request.POST)
		if form.is_valid():
			CustomUser.add_user_by_form(username=form.get_username(), password=form.get_password(), email=form.get_email(), avatar='image/default_pp.png')
			login(request, user=CustomUser.get_user_by_name(name=form.get_username()))
			return redirect('user_profile')

	else:
		form = CustomUserCreationForm()
	return render(request, 'game/register.html', {'form': form})

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
				return redirect('user_profile')
			else:
				print(f"Authentication failed for {username}")
				return render(request, 'game/login.html', {'form': form, 'error': 'Username or Password wrong'})
	else:
		form = LoginForm()
	return render(request, 'game/login.html', {'form': form})

@login_required
def user_profile(request):
    user = request.user
    context = {
        'username': user.username,
        'email': user.email,
        'date_joined': user.date_joined,
    }
    return render(request, 'game/user_profile.html', context)