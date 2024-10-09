"""
ASGI config for transcendence project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import socketio
from chat.consumers import ChatConsumer
from django.urls import path

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'transcendence.settings')

django_asgi_app = get_asgi_application()

sio = socketio.AsyncServer(async_mode='asgi')
socket_app = socketio.ASGIApp(sio)

application = ProtocolTypeRouter({
	"http": django_asgi_app,
	'websocket': URLRouter([
        path('ws/chat/', ChatConsumer.as_asgi()),
	]),
})
