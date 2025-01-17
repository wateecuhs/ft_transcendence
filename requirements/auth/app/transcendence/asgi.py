"""
ASGI config for transcendence project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "transcendence.settings")

from django.core.asgi import get_asgi_application
django_asgi_app = get_asgi_application()

from api.utils import save_match
from threading import Thread
import redis
import json


redis_client = redis.Redis(host='match-redis', port=6379, db=0)

def listen_to_game_results():
    pubsub = redis_client.pubsub()
    pubsub.subscribe('game_results')
    for message in pubsub.listen():
        if message['type'] == 'message':
            game_result = json.loads(message['data'])
            room_name = game_result['room_name']
            player1 = game_result['player_1']
            player2 = game_result['player_2']
            player1_status = game_result['player_1_win']
            player2_status = game_result['player_2_win']
            player1_score = game_result['score'][0]
            player2_score = game_result['score'][1]
            save_match(player1=player1, player2=player2, user1_win=player1_status, user2_win=player2_status, player1_score=player1_score, player2_score=player2_score)

Thread(target=listen_to_game_results, daemon=True).start()

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import socketio
from django.urls import path



sio = socketio.AsyncServer(async_mode='asgi')

application = ProtocolTypeRouter({
	"http": django_asgi_app,
})
