from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from .serializers import TournamentSerializer
from .models import Tournament

class TournamentsView(APIView):
    def get(self, request: Request):
        tournaments = Tournament.objects.filter(status=Tournament.Status.PENDING)
        serializer = TournamentSerializer(tournaments, many=True)
        return Response(serializer.data)