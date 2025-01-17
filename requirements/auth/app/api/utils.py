import requests, os, uuid, base64
from datetime import datetime, timedelta
from .models import CustomUser, Match
from django.http import HttpResponse
from django.core.files.base import ContentFile
import jwt

'''
CreateAccessToken take an username. Create, stock in DB and return an encoded_access_token
'''

def CreateAccessToken(request, username):
	user = CustomUser.get_user_by_name(username)
	if not user:
		return None
	exp_access = datetime.now() + timedelta(minutes=30)
	iat = datetime.now()
	payload = {
		"username": username,
		"id": str(user.id),
		"exp": int(exp_access.timestamp()),
		"iat": int(iat.timestamp())
	}
	encoded_access_jwt = jwt.encode(payload, os.getenv('JWT_ACCESS_KEY'), algorithm="HS256")
	user.access_token = encoded_access_jwt
	user.save()
	return encoded_access_jwt

'''
CreateRefreshToken take an username. Create and set as cookie an encoded_refresh_token
'''

def CreateRefreshToken(request, username):
    user = CustomUser.get_user_by_name(username)
    if user is None:
        return None
    exp_refresh = datetime.now() + timedelta(days=7)
    iat = datetime.now()
    payload = {
        "username": username,
        "id": str(user.id),
        "exp": int(exp_refresh.timestamp()),
        "iat": int(iat.timestamp())
    }
    encoded_refresh_jwt = jwt.encode(payload, os.getenv('JWT_REFRESH_KEY'), algorithm="HS256")
    user.refresh_token = encoded_refresh_jwt
    user.save()
    return encoded_refresh_jwt

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
    if not user:
        return False
    if user.refresh_token != encoded_refresh_token:
        raise jwt.InvalidTokenError
    return True

'''
decodeAccessToken take an access_token. Check if access token is valid and not expire and return the payload with information.
On failure raise exception with custom message
'''

def decodeAccessToken(request, encoded_jwt):
	try:
		payload = jwt.decode(encoded_jwt, os.getenv('JWT_ACCESS_KEY'), algorithms=["HS256"])
		if "id" in payload:
			payload["id"] = uuid.UUID(payload["id"])
		username = payload["username"]
		user = CustomUser.get_user_by_name(username)
		if user:
			if user.access_token != encoded_jwt:
				raise jwt.InvalidTokenError
			return payload
		else:
			return None
	except jwt.ExpiredSignatureError:
		raise jwt.ExpiredSignatureError
	except jwt.InvalidTokenError:
		raise jwt.InvalidTokenError

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
		return None
	except jwt.ExpiredSignatureError:
		raise jwt.ExpiredSignatureError
	except jwt.InvalidTokenError:
		raise jwt.InvalidTokenError


def decode_and_save_base64_image(base64_image, file_name):
    if base64_image.startswith('data:image'):
        header, base64_str = base64_image.split(',', 1)

        image_data = base64.b64decode(base64_str)

        return ContentFile(image_data, name=file_name)
    else:
        raise ValueError("Invalid base64 image data")

def save_match(player1, player2, user1_win, user2_win, player1_score, player2_score):
	user1 = CustomUser.get_user_by_name(player1)
	user2 = CustomUser.get_user_by_name(player2)
	Match.create_match(user=user1, user_win=user1_win, user_score=player1_score, opponent_score=player2_score, user_name=player1, opponent_name=player2)
	Match.create_match(user=user2, user_win=user2_win, user_score=player2_score, opponent_score=player1_score, user_name=player2, opponent_name=player1)
