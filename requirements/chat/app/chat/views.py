from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from .serializers import MessageSerializer
from .models import Message
from .enums import MessageType
import chat.models as cmod
from datetime import datetime


class MessagesView(APIView):
    def get(self, request):
        messages = Message.objects.order_by("created_at").all()
        serializer = MessageSerializer(messages, many=True)
        message_history = []
        for message in serializer.data:
            formatted_time = datetime.strptime(message['created_at'], "%Y-%m-%dT%H:%M:%S.%fZ").strftime("%H-%M")
            message_history.append({'type': MessageType.Chat.HISTORY, 'data': {
                'content': message['content'],
                'author': message['author'],
                'created_at': formatted_time
            }})
        return Response(message_history)
    
class FriendsView(APIView):
    def get(self, request: Request, username: str):
         return Response(list(cmod.User.objects.get(username=username).get_friends()))