from django.urls import re_path
from .consumers import GameConsumer

websocket_urlpatterns = [
    re_path(r'ws/ai_training/(?P<room_name>\w+)/$', GameConsumer.as_asgi()),
]
