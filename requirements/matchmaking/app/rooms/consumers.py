from channels.generic.websocket import AsyncWebsocketConsumer
from .enums import MessageType
from .serializers import RoomSerializer
from asgiref.sync import sync_to_async
from .models import Room, User
import traceback
import logging
import json

logger = logging.getLogger(__name__)

class RoomConsumer(AsyncWebsocketConsumer):
    user_count = 1
    room = None

    async def connect(self):
        self.user_id = str(type(self).user_count)
        type(self).user_count += 1
        if await sync_to_async(User.objects.filter(username=self.user_id).exists)():
            self.user = await sync_to_async(User.objects.get)(username=self.user_id)
        else:
            self.user = await sync_to_async(User.objects.create)(username=self.user_id)

        logger.info(f"[{self.user_id}] Connected.")
        await self.accept()
        

    async def disconnect(self, close_code):
        logger.info(f"[{self.user_id}] Disconnected. ({close_code})")
        if self.room:
            self.channel_layer.group_discard(self.room, self.channel_name)

    async def receive(self, text_data):
        logger.info(f"[{self.user_id}] Received message: {text_data}")  
        try:
            event = json.loads(text_data)
        except json.JSONDecodeError as e:
            await self.error(f"Invalid JSON format. ({e})")
            return

        match event["type"]:
            case MessageType.Room.CREATE:
                await self._handle_create_room(event)
            case MessageType.Room.JOIN:
                await self._handle_join_room(event)
            case MessageType.Room.LEAVE:
                await self._handle_leave_room(event)

        await self.send(text_data=text_data)
    
    async def _handle_create_room(self, event):
        data = event["data"]
        try:
            serializer = RoomSerializer(data=data)
            print(repr(serializer), flush=True)
            await sync_to_async(serializer.is_valid)(raise_exception=True)
            await self.channel_layer.group_add(serializer.validated_data["label"], self.channel_name)
            self.room = serializer.validated_data["label"]
            self.user.room = serializer.validated_data["label"]
            await sync_to_async(serializer.save)()
            await sync_to_async(self.user.save)()
        except Exception as e:
            print(traceback.format_exc(), flush=True)
            await self.error(str(e))
        return

    async def _handle_join_room(self, event):
        data = event["data"]
        try:
            logger.info(f"[{self.user_id}] Joining room {data['label']}")
            room = await sync_to_async(Room.objects.exclude(status=Room.Status.FINISHED).get)(label=data["label"])
            await self.channel_layer.group_add(data["label"], self.channel_name)
            self.room = data["label"]
            await self.channel_layer.group_send(data["label"], {"type": MessageType.Room.JOIN, "data": data})
            self.user.room = data["label"]
            await sync_to_async(self.user.save)()

        except Room.DoesNotExist:
            await self.error("Room does not exist.")
        except Exception as e:
            await self.error(str(e))

    async def _handle_leave_room(self, event):
        pass

    async def error(self, error):
        logger.error(f"[{self.user_id}] Error: {error}")
        await self.send(json.dumps(("error", {"error": error})))
