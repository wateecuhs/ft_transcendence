"""
ASGI config for live_chat project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.sessions import SessionMiddlewareStack
from consumers.consumers import ChatConsumer
from django.urls import path
import logging
import sys

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

env_variables = ["CLIENT_ID", "CLIENT_SECRET"]

if not all([os.getenv(var) for var in env_variables]):
    print("You need to set the following environment variables:")
    print(env_variables)
    sys.exit(1)


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "live_chat.settings")
django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": SessionMiddlewareStack(
            URLRouter(
                [
                    path("ws/chat/", ChatConsumer.as_asgi()),
                ]
            )
        ),
    }
)
