from django.shortcuts import render

def pong_game(request):
    return render(request, 'game/pong_game.html')

