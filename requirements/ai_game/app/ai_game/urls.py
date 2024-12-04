from django.urls import path
from . import views

urlpatterns = [
    path('ai_game/', views.ai_game, name='pong_game'),
]
