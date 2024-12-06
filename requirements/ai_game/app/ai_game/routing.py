from django.urls import re_path
from django.urls import path
from .consumers import GameConsumer

websocket_urlpatterns = [
    re_path(r'^rooms/(?P<room_name>\w+)/?$', GameConsumer.as_asgi()),
    # path('rooms/room1/', GameConsumer.as_asgi()),
]
