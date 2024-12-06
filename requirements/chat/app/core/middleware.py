from channels.middleware import BaseMiddleware
from django.core.exceptions import ObjectDoesNotExist
import chat.enums as enu
import json
import requests
from channels.db import database_sync_to_async

class TokenAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        # test = json.loads(scope["query_string"].decode())-
        headers = dict(scope["headers"])
        cookies = {}
        for cookie in headers[b"cookie"].decode().split("; "):
            cookies[cookie.split("=")[0]] = cookie.split("=")[1]
        r = requests.get("http://auth:8001/user/me/", headers={"Authorization": f"Bearer {cookies['access_token']}"})
        scope["user"] = r.json()
        return await super().__call__(scope, receive, send)

    @database_sync_to_async
    def get_user(self, token):
        from chat.models import User
        try:
            user = User.objects.get(token=token)
            return user
        except ObjectDoesNotExist:
            return None