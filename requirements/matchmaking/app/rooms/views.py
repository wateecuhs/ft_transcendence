from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from .serializers import RoomSerializer
from .models import Room

class RoomsView(APIView):
    def get(self, request: Request):
        if request.query_params.get('status'):
            rooms = Room.objects.filter(status=request.query_params.get("status"))
        rooms = Room.objects.all()
        serializer = RoomSerializer(rooms, many=True)
        return Response(serializer.data)

    def post(self, request: Request):
        try:
            serializer = RoomSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

class RoomView(APIView):
    def get(self, request: Request, label: str):
        room = Room.objects.get(label=label)

        return Response({"message": "Hello, world!"})