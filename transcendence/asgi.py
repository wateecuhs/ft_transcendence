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
from channels.sessions import SessionMiddlewareStack
import socketio
from chat.consumers import ChatConsumer
from django.urls import path
import sys

env_variables = ['CLIENT_ID', 'CLIENT_SECRET']

if not all([os.getenv(var) for var in env_variables]):
	print("You need to set the following environment variables:")
	print(env_variables)
	sys.exit(1)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'transcendence.settings')

django_asgi_app = get_asgi_application()

sio = socketio.AsyncServer(async_mode='asgi')
socket_app = socketio.ASGIApp(sio)

application = ProtocolTypeRouter({
	"http": django_asgi_app,
	'websocket': SessionMiddlewareStack(URLRouter([
        path('ws/chat/', ChatConsumer.as_asgi()),
	])),
})
