from http.client import responses
from os import access
from urllib.parse import uses_relative
from django.contrib.auth import login
from django.template.context_processors import request
from .models import User
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
import requests
import  os
from dotenv import load_dotenv


# Index take the request and just return the render of an index page.

def index(request):
    return render(request, "game/index.html")

# Succes take the request. In request's url we can find a code. This code will be used to connect the user to his intra's account.
# Then he will be redirect to the success page and we will get his login and his profile picture

def success(request):
    code = request.GET.get('code')
    token_url = 'https://api.intra.42.fr/oauth/token'
    load_dotenv()

    client_id = os.getenv('CLIENT_ID')
    client_secret = os.getenv('CLIENT_SECRET')
    redirect_uri = 'http://localhost:8000/success'

    params = {
        'grant_type': 'authorization_code',
        'client_id': client_id,
        'client_secret': client_secret,
        'code': code,
        'redirect_uri': redirect_uri
    }
    response = requests.post(token_url, data=params)

    if response.ok:
        access_token = response.json()['access_token']
        response = requests.get('https://api.intra.42.fr/v2/me', headers={'Authorization': f'Bearer {access_token}'}).json()
        payload = {"login": response['login'], "image": response['image']['versions']['small']}
        request.session['user_info'] = payload
        return JsonResponse(payload, status=200)
    else:
        return JsonResponse({"coucou": response.text}, status=400)