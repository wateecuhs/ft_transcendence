from channels.middleware import BaseMiddleware
from django.core.exceptions import ObjectDoesNotExist
import chat.enums as enu
import json
from channels.db import database_sync_to_async

class TokenAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        # test = json.loads(scope["query_string"].decode())-
        headers = dict(scope["headers"])
        print("headers", headers, flush=True)
        print("keys", headers.keys(), flush=True)
        print("cookie", headers[b"cookie"].decode(), flush=True)
        cookies = {}
        for cookie in headers[b"cookie"].decode().split("; "):
            cookies[cookie.split("=")[0]] = cookie.split("=")[1]
        print("cookies", cookies, flush=True)
        return await super().__call__(scope, receive, send)

    @database_sync_to_async
    def get_user(self, token):
        from chat.models import User
        try:
            user = User.objects.get(token=token)
            return user
        except ObjectDoesNotExist:
            return None