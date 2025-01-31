from channels.middleware import BaseMiddleware
import requests

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
            scope["user"] = {"id": user_data["id"], "username": user_data["username"], "alias": user_data["alias"]}
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
