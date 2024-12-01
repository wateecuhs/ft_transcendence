from django.shortcuts import render
import requests

def ai_game(request):
    return render(request, 'ai_training/pong_game.html')
