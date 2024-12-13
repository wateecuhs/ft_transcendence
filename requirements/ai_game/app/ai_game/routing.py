from django.urls import re_path
from django.urls import path
from .consumers import AIGameConsumer

websocket_urlpatterns = [
    re_path(r'^rooms/(?P<room_name>\w+)/?$', AIGameConsumer.as_asgi()),
]
