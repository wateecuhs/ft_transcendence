import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")

from django.core.asgi import get_asgi_application
django_asgi_app = get_asgi_application()


from channels.routing import ProtocolTypeRouter, URLRouter  # noqa: E402
from channels.sessions import SessionMiddlewareStack  # noqa: E402
from core.middleware import TokenAuthMiddleware  # noqa: E402
from rooms.consumers import TournamentConsumer  # noqa: E402
from django.urls import path  # noqa: E402
from threading import Thread  # noqa: E402
import logging  # noqa: E402
import redis  # noqa: E402
import json  # noqa: E402
from channels.layers import get_channel_layer  # noqa: E402
from asgiref.sync import async_to_sync  # noqa: E402
from rooms.enums import MessageType  # noqa: E402

redis_client = redis.Redis(host='match-redis', port=6379, db=0)

def listen_to_game_results():
    pubsub = redis_client.pubsub()
    pubsub.subscribe('game_results')
    
    for message in pubsub.listen():
        if message['type'] == 'message':
            game_result = json.loads(message['data'])
            if game_result["room_name"].startswith("room_t_") is False:
                continue
            channel_layer = get_channel_layer()
            winner = game_result['player_1'] if game_result['score'][0] > game_result['score'][1] else game_result['player_2']
            async_to_sync(channel_layer.group_send)(
                f"user.{winner}",
                {
                    "type": MessageType.Tournament.RESULT,
                    "data": game_result
                }
            )

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
