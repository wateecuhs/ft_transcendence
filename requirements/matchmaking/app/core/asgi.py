import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")

from django.core.asgi import get_asgi_application
django_asgi_app = get_asgi_application()


from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.sessions import SessionMiddlewareStack
from core.middleware import TokenAuthMiddleware
from rooms.consumers import TournamentConsumer
from django.urls import path
from threading import Thread
import logging
import redis
import json

redis_client = redis.Redis(host='match-redis', port=6379, db=0)

def listen_to_game_results():
    pubsub = redis_client.pubsub()
    pubsub.subscribe('game_results')
    
    for message in pubsub.listen():
        if message['type'] == 'message':
            game_result = json.loads(message['data'])
            logger.info(f"Received game result: {game_result}")

Thread(target=listen_to_game_results, daemon=True).start()


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
                        path("", TournamentConsumer.as_asgi()),
                    ]
                )
            )
        ),
    }
)
