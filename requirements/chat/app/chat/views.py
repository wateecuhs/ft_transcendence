from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import MessageSerializer
from .models import Message
from .enums import MessageType


class MessagesView(APIView):
    def get(self, request):
        print("Testing", flush=True)
        messages = Message.objects.order_by("created_at").all()
        # test = Message.objects.filter(type=Message.Type.PUBLIC).order_by("created_at").all()
        serializer = MessageSerializer(messages, many=True)
        message_history = []
        for message in serializer.data:
            message_history.append({'type': MessageType.Chat.HISTORY, 'data': {
                'content': message['content'],
                'author': message['author'],
                'created_at': message['created_at']
            }})
        return Response(message_history)
