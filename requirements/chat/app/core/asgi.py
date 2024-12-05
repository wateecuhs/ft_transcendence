import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")

from django.core.asgi import get_asgi_application
django_asgi_app = get_asgi_application()


from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.sessions import SessionMiddlewareStack
from core.middleware import TokenAuthMiddleware
from chat.consumers import ChatConsumer
from django.urls import path
import logging

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

logger.info(f"DJANGO_SETTINGS_MODULE: {os.environ.get('DJANGO_SETTINGS_MODULE')}")
application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": TokenAuthMiddleware(
            SessionMiddlewareStack(
                URLRouter(
                    [
                        path("", ChatConsumer.as_asgi()),
                    ]
                )
            )
        ),
    }
)
