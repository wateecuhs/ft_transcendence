from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

# Create your views here.
def index(request):
	return render(request, "frontend/index.html")

def get_user_info(request):
	if "user_info" not in request.session:
		return JsonResponse({"error": "Not logged in"})
	return JsonResponse(request.session["user_info"])

def room_join(request, room_code):
	return HttpResponse(f"Joining room {room_code}.")

def friend_add(request, username):
	return HttpResponse(f"Sending friend request to {username}.")

def login(request):
	return HttpResponse(f"test")