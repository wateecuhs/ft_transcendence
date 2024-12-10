from channels.middleware import BaseMiddleware
from django.core.exceptions import ObjectDoesNotExist
import json
import requests
from channels.db import database_sync_to_async

class TokenAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        try:
            headers = dict(scope["headers"])
            cookies = {}
            for cookie in headers[b"cookie"].decode().split("; "):
                cookies[cookie.split("=")[0]] = cookie.split("=")[1]
        except KeyError:
            scope["user"] = None
            return await super().__call__(scope, receive, send)
        r = requests.get("http://auth:8001/user/me/", headers={"Authorization": f"Bearer {cookies['access_token']}"})
        if r.status_code != 200:
            scope["user"] = None
            return await super().__call__(scope, receive, send)
        user_data = r.json()
        scope["user"] = {"id": user_data["id"], "username": user_data["username"]}
        return await super().__call__(scope, receive, send)
