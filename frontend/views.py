from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

# Create your views here.
def index(request):
	return render(request, "frontend/index.html")

def room_join(request, room_code):
	return HttpResponse(f"Joining room {room_code}.")

def friend_add(request, username):
	return HttpResponse(f"Sending friend request to {username}.")

def login(request):
	return HttpResponse(f"test")

def get_user_info(request):
	print(request.session["user_info"])
	return JsonResponse(request.session["user_info"])