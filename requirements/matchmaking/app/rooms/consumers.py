from channels.generic.websocket import AsyncWebsocketConsumer
from .enums import MessageType
from .serializers import RoomSerializer
from asgiref.sync import sync_to_async
from .models import Room
from uuid import UUID
import traceback
import logging
import json

logger = logging.getLogger(__name__)

"""
    Fields required in each message type:
    - type: MessageType
    - data: dict

    Fields in data for:
    - MessageType.Room.CREATE:
        - author: UUID
        - label: str
        - room_type: str
        - max_players: int

    - MessageType.Room.JOIN:
        - author: UUID
        - label: str
"""

class RoomConsumer(AsyncWebsocketConsumer):
    room = None

    async def connect(self):
        self.user_id = self.scope["user"]["id"]
        self.username = self.scope["user"]["username"]

        logger.info(f"[{self.username}] Connected.")
        await self.channel_layer.group_add(f"user.{self.username}", self.channel_name)
        logger.info(f"[{self.username}] Added to group user.{self.username}")
        await self.accept()

    async def disconnect(self, close_code):
        logger.info(f"[{self.username}] Disconnected. ({close_code})")
        if self.room:
            await self.channel_layer.group_discard(self.room, self.channel_name)
        await self.channel_layer.group_discard(f"user.{self.username}", self.channel_name)
        await self.channel_layer.group_discard("matchmaking", self.channel_name)

    async def receive(self, text_data):
        logger.info(f"[{self.username}] Received message: {text_data}")
        print(flush=True)
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
            case MessageType.Room.DELETE:
                await self._handle_delete_room(event)
            case MessageType.Matchmaking.JOIN:
                await self._handle_matchmaking_join(event)
            case MessageType.Matchmaking.LEAVE:
                await self._handle_matchmaking_leave(event)
    
    async def _handle_create_room(self, event):
        try:
            logger.info(f"[{self.username}] Create room: {event}")
            data = event["data"]
            data["owner"] = self.user_id
            serializer = RoomSerializer(data=data)
            await sync_to_async(serializer.is_valid)(raise_exception=True)
            await self.channel_layer.group_add(serializer.validated_data["label"], self.channel_name)
            self.room = serializer.validated_data["label"]
            await sync_to_async(serializer.save)()
            await self.channel_layer.group_send(serializer.validated_data["label"], {"type": MessageType.Room.CREATE, "data": serializer.data})
        except Exception as e:
            await self.error(str(e))
        return {"type": MessageType.Room.CREATE, "data": serializer.data}

    async def _handle_join_room(self, event):
        data = event["data"]
        try:
            logger.info(f"[{self.username}] Joining room {data['label']}")
            await sync_to_async(Room.objects.exclude(status=Room.Status.FINISHED).get)(label=data["label"])
            await self.channel_layer.group_add(data["label"], self.channel_name)
            self.room = data["label"]
            data["author"] = self.username
            await self.channel_layer.group_send(data["label"], {"type": MessageType.Room.JOIN, "data": data})
            await sync_to_async(self.username.save)()

        except Room.DoesNotExist:
            await self.error("Room does not exist.")
        except Exception as e:
            await self.error(str(e))

    async def _handle_leave_room(self, event):
        data = event["data"]
        try:
            await self.channel_layer.group_discard(data["label"], self.channel_name)
            self.room = None
            await sync_to_async(self.username.save)()
            data["author"] = self.username
            await self.channel_layer.group_send(data["label"], {"type": MessageType.Room.LEAVE, "data": data})
        except Exception as e:
            await self.error(str(e))

    async def _handle_delete_room(self, event):
        data = event["data"]
        try:
            room = await sync_to_async(Room.objects.get)(label=data["label"])
            if room.owner != self.user_id:
                await self.error("You are not the author of this room.")
                return
            await sync_to_async(room.delete)()
            await self.channel_layer.group_discard(data["label"], self.channel_name)
        except Room.DoesNotExist:
            await self.error("Room does not exist.")
        except Exception as e:
            await self.error(str(e))

    async def _handle_matchmaking_join(self, event):
        try:
            await self.channel_layer.group_add("matchmaking", self.channel_name)
            await self.channel_layer.group_send("matchmaking", {"type": MessageType.Matchmaking.JOIN, "author": self.username})
        except Exception as e:
            await self.error(str(e))

    async def _handle_matchmaking_leave(self, event):
        try:
            await self.channel_layer.group_discard("matchmaking", self.channel_name)
            await self.channel_layer.group_send("matchmaking", {"type": MessageType.Matchmaking.LEAVE, "author": self.username})
        except Exception as e:
            await self.error(str(e))

    """
    Default routing methods
    """

    async def room_join(self, event):
        logger.info(f"[{self.username}] Room join: {event['data']}")
        await self.send(json.dumps(("room.join", event["data"])))
    
    async def room_leave(self, event):
        logger.info(f"[{self.username}] Room leave: {event['data']}")
        await self.send(json.dumps(("room.leave", event["data"])))

    async def error(self, error):
        logger.error(f"[{self.username}] Error: {error}")
        await self.send(json.dumps(("error", {"error": error})))
    
    async def room_create(self, event):
        logger.info(f"[{self.username}] Room create: {event['data']}")
        await self.send(json.dumps(("room.create", event["data"])))

    async def matchmaking_join(self, event):
        logger.info(f"[{self.username}] Matchmaking join: {event['author']}")
        print(event["author"], self.username, flush=True)
        if event["author"] != self.username:
            await self.channel_layer.group_send(f"user.{event['author']}", {"type": MessageType.Matchmaking.ACCEPT, "author": event["author"]})
            await self.channel_layer.group_send(f"user.{self.username}", {"type": MessageType.Matchmaking.ACCEPT, "author": self.username})
            return
        await self.send(json.dumps(("matchmaking.join", event["author"])))

    async def matchmaking_accept(self, event):
        logger.info(f"[{self.username}] Matchmaking accept: {event['author']}")
        await self.channel_layer.group_discard("matchmaking", self.channel_name)
        await self.send(json.dumps(("matchmaking.accept", event["author"])))

    async def matchmaking_leave(self, event):
        logger.info(f"[{self.username}] Matchmaking leave: {event['author']}")
        await self.send(json.dumps(("matchmaking.leave", event["author"])))
                        
