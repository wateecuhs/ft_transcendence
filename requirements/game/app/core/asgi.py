"""
ASGI config for core project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""
from redis.asyncio import ConnectionPool
pool = ConnectionPool(host='match-redis', port=6379, db=0)

import os
import socketio
import game.routing
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.sessions import SessionMiddlewareStack
from django.core.asgi import get_asgi_application
from core.middleware import TokenAuthMiddleware

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

django_asgi_app = get_asgi_application()

sio = socketio.AsyncServer(async_mode="asgi")
socket_app = socketio.ASGIApp(sio)

application = ProtocolTypeRouter(
    {
        "websocket": TokenAuthMiddleware(
            SessionMiddlewareStack(
                URLRouter( 
                    game.routing.websocket_urlpatterns
                )
            )
        ),
        "http": get_asgi_application(),
    }
)