from os import access

import jwt
from tempfile import NamedTemporaryFile

from cryptography.fernet import Fernet
from django.db.models.fields import return_None
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
import requests
import  os, base64

from pyasn1_modules.rfc5280 import ub_serial_number
from twisted.scripts.htmlizer import header

from db.models import CustomUser
from api.views import set_cookie_refresh
from .forms import changeAliasForm, changePpForm, changeEmailForm, changePasswordForm
from django.core.files.storage import FileSystemStorage
from django.conf import settings
from datetime import datetime, timedelta



# Create your views here.
def index(request):
	return render(request, "frontend/index.html")

def room_join(request, room_code):
	return HttpResponse(f"Joining room {room_code}.")

def friend_add(request, username):
	return HttpResponse(f"Sending friend request to {username}.")