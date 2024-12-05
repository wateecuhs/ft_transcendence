"""
ASGI config for core project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os
import socketio
import ai_game.routing
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.sessions import SessionMiddlewareStack

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

django_asgi_app = get_asgi_application()

sio = socketio.AsyncServer(async_mode="asgi")
socket_app = socketio.ASGIApp(sio)

application = ProtocolTypeRouter(
    {
        "websocket": SessionMiddlewareStack(
            URLRouter(
                ai_game.routing.websocket_urlpatterns
            )
        ),
        "http": get_asgi_application(),
    }
)