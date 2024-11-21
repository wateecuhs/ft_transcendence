import requests, jwt, os, uuid
from datetime import datetime, timedelta
from .models import CustomUser
from django.http import HttpResponse
from jwt import InvalidTokenError, ExpiredSignatureError

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
CreateAccessToken take an username. Create, stock in DB and return an encoded_access_token
'''

def CreateAccessToken(request, username):
	user = CustomUser.get_user_by_name(username)
	exp_access = datetime.now() + timedelta(hours=5)
	iat = datetime.now()
	payload = {
		"username": username,
		"id": str(user.id),
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
		"id": str(user.id),
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
checkRefreshToken check if the refresh token in cookies is the same that the refresh token in db
'''

def checkRefreshToken(encoded_refresh_token, username):
	user = CustomUser.get_user_by_name(username)
	if user.refresh_token is not encoded_refresh_token:
		raise InvalidTokenError

'''
decodeAccessToken take an access_token. Check if access token is valid and not expire and return the payload with information.
On failure raise exception with custom message
'''

def decodeAccessToken(request, encoded_jwt):
	try:
		payload = jwt.decode(encoded_jwt, os.getenv('JWT_ACCESS_KEY'), algorithms=["HS256"])
		if "id" in payload:
			payload["id"] = uuid.UUID(payload["id"])
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
		payload = jwt.decode(encoded_jwt, os.getenv('JWT_REFRESH_KEY'), algorithms=["HS256"])
		if "id" in payload:
			payload["id"] = uuid.UUID(payload["id"])
		return payload
		return payload
	except jwt.ExpiredSignatureError:
		raise ExpiredSignatureError
	except jwt.InvalidTokenError:
		raise InvalidTokenError