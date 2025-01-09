"""
ASGI config for transcendence project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os
from api.utils import save_match
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'transcendence.settings')


from django.core.asgi import get_asgi_application
django_asgi_app = get_asgi_application()

from threading import Thread
import redis
import json


redis_client = redis.Redis(host='match-redis', port=6379, db=0)

def listen_to_game_results():
    pubsub = redis_client.pubsub()
    pubsub.subscribe('game_results')
    print("Listening to game results in api", flush=True)
    for message in pubsub.listen():
        if message['type'] == 'message':
            game_result = json.loads(message['data'])
            print(f"Received game result in api: {game_result}", flush=True)
            room_name = game_result['room_name']
            if room_name.startswith('room_mm'):
                player1 = game_result['player_1']
                player2 = game_result['player_2']
                player1_status = '1' if game_result['player_1_win'] else '2'
                player2_status = '1' if game_result['player_2_win'] else '2'
                player1_score = game_result['score'][0]
                player2_score = game_result['score'][1]
                print(f"Player 1: {player1} {player1_status} with score {player1_score}", flush=True)
                print(f"Player 2: {player2} {player2_status} with score {player2_score}", flush=True)
                save_match(player1, player2, player1_status, player2_status, player1_score, player2_score)

Thread(target=listen_to_game_results, daemon=True).start()

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import socketio
from django.urls import path



sio = socketio.AsyncServer(async_mode='asgi')

application = ProtocolTypeRouter({
	"http": django_asgi_app,
})
