from channels.middleware import BaseMiddleware
from django.core.exceptions import ObjectDoesNotExist
from chat.models import User
import requests
from channels.db import database_sync_to_async

class TokenAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        try:
            headers = dict(scope["headers"])
            cookies = {}
            for cookie in headers[b"cookie"].decode().split("; "):
                cookies[cookie.split("=")[0]] = cookie.split("=")[1]
            r = requests.get("http://auth:8001/user/me/", headers={"Authorization": f"Bearer {cookies['access_token']}"})
            if r.status_code != 200:
                scope["user"] = None
                return await super().__call__(scope, receive, send)
            user_data = r.json()
            try:
                user = await database_sync_to_async(User.objects.get)(username=(user_data["username"]))
            except ObjectDoesNotExist:
                user = await database_sync_to_async(User.objects.create)(username=user_data["username"], status=User.Status.ONLINE)
            scope["user"] = user
            return await super().__call__(scope, receive, send)
        except KeyError:
            scope["user"] = None
            return await super().__call__(scope, receive, send)
        except requests.exceptions.ConnectionError:
            scope["user"] = None
            return await super().__call__(scope, receive, send)
        except Exception as e:
            scope["user"] = None
            return await super().__call__(scope, receive, send)

    @database_sync_to_async
    def get_user(self, token):
        from chat.models import User
        try:
            user = User.objects.get(token=token)
            return user
        except ObjectDoesNotExist:
            return None