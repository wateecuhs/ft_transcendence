from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from .models import Room

class RoomsView(APIView):
    def get(self, request: Request):
        if request.query_params.get('status'):
            rooms = Room.objects.filter(status=request.query_params.get("status"))
        rooms = Room.objects.all()

        return Response({"message": "Hello, world!"})

class RoomView(APIView):
    def get(self, request: Request, label: str):
        room = Room.objects.get(label=label)

        return Response({"message": "Hello, world!"})