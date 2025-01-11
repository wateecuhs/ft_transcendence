from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import MessageSerializer
from .models import Message
import chat.models as cmod
from .enums import MessageType
from datetime import datetime
import requests

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
    def get(self, request):
        try:
            token = request.headers.get("Authorization").split(" ")[1]
            r = requests.get("http://auth:8001/user/me/", headers={"Authorization": f"Bearer {token}"})
            if r.status_code != 200:
                return Response("Invalid token", status=403)
            username = r.json()["username"]
            user, created = cmod.User.objects.get_or_create(username=username)
            return Response([str(username) for username in user.get_friends()])
        except cmod.User.DoesNotExist:
            return Response("User not found", status=404)
        except ValueError:
            return Response("Invalid token", status=403)
        except IndexError:
            return Response("No token provided", status=401)
        except AttributeError:
            return Response("No token provided", status=401)
        except Exception as e:
            return Response(f"An error occurred {e}", status=500)
