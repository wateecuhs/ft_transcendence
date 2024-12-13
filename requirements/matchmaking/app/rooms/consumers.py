from channels.generic.websocket import AsyncWebsocketConsumer
from .enums import MessageType
from .serializers import RoomSerializer, TournamentSerializer
from asgiref.sync import sync_to_async
from .models import Room, Tournament
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
        - name: str

    - MessageType.Room.JOIN:
        - author: UUID
        - name: str
"""

class RoomConsumer(AsyncWebsocketConsumer):
    room = None
    tournament = None

    async def connect(self):
        self.user_id = self.scope["user"]["id"]
        self.username = self.scope["user"]["username"]

        logger.info(f"[{self.username}] Connected.")
        await self.channel_layer.group_add(f"user.{self.username}", self.channel_name)
        logger.info(f"[{self.username}] Added to group user.{self.username}")
        await self.accept()

    async def disconnect(self, close_code):
        logger.info(f"[{self.username}] Disconnected. ({close_code})")
        self.leave_rooms()
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
            case MessageType.Room.START:
                await self._handle_room_start(event)
            case MessageType.Matchmaking.JOIN:
                await self._handle_matchmaking_join(event)
            case MessageType.Matchmaking.LEAVE:
                await self._handle_matchmaking_leave(event)
            case MessageType.Tournament.CREATE:
                await self._handle_tournament_create(event) 
            case MessageType.Tournament.JOIN:
                await self._handle_tournament_join(event)
            case MessageType.Tournament.LEAVE:
                await self._handle_tournament_leave(event)
            case MessageType.Tournament.START:
                await self._handle_tournament_start(event)
    
    async def _handle_create_room(self, event):
        try:
            logger.info(f"[{self.username}] Create room: {event}")
            data = event["data"]
            data["owner"] = self.user_id
            data["players"] = [self.username]
            serializer = RoomSerializer(data=data)
            await self.leave_rooms()
            await sync_to_async(serializer.is_valid)(raise_exception=True)
            await self.channel_layer.group_add(f"room.{serializer.validated_data['name']}", self.channel_name)
            self.room = serializer.validated_data["name"]
            await sync_to_async(serializer.save)()
            await self.channel_layer.group_send(f"room.{serializer.validated_data['name']}", {"type": MessageType.Room.CREATE, "data": serializer.data})
        except Exception as e:
            await self.error(str(e))
        return {"type": MessageType.Room.CREATE, "data": serializer.data}

    async def _handle_join_room(self, event):
        data = event["data"]
        try:
            logger.info(f"[{self.username}] Joining room {data['name']}")
            await sync_to_async(Room.objects.exclude(status=Room.Status.FINISHED).get)(name=data["name"])
            await self.leave_rooms()
            await self.channel_layer.group_add(f"room.{data['name']}", self.channel_name)
            self.room = data["name"]
            data["author"] = self.username
            await self.channel_layer.group_send(f"room.{data['name']}", {"type": MessageType.Room.JOIN, "data": data})
            await sync_to_async(self.username.save)()

        except Room.DoesNotExist:
            await self.error("Room does not exist.")
        except Exception as e:
            await self.error(str(e))

    async def _handle_tournament_create(self, event):
        try:
            data = event["data"]
            data["owner"] = self.user_id
            data["players"] = [self.username]
            serializer = TournamentSerializer(data=data)
            await self.leave_rooms()
            await sync_to_async(serializer.is_valid)(raise_exception=True)
            await self.channel_layer.group_add(f"tournament.{serializer.validated_data['name']}", self.channel_name)
            self.room = serializer.validated_data["name"]
            await sync_to_async(serializer.save)()
            await self.channel_layer.group_send(f"tournament.{serializer.validated_data['name']}", {"type": MessageType.Tournament.CREATE, "data": serializer.data})
        except Exception as e:
            await self.error(str(e))

    async def _handle_tournament_join(self, event):
        data = event["data"]
        try:
            tournament = await sync_to_async(Tournament.objects.exclude(status=Tournament.Status.FINISHED).get)(name=data["name"])
            if len(tournament.players) >= tournament.max_players:
                await self.error("Tournament is full.")
                return
            if self.username in tournament.players:
                await self.error("You are already in this tournament.")
                return
            await self.leave_rooms()
            await self.channel_layer.group_add(f"tournament.{data['name']}", self.channel_name)
            self.room = data["name"]
            data["author"] = self.username
            tournament.players.append(self.username)
            await sync_to_async(tournament.save)()
            data["players"] = tournament.players
            await self.channel_layer.group_send(f"tournament.{data['name']}", {"type": MessageType.Tournament.JOIN, "data": data})

        except Tournament.DoesNotExist:
            await self.error("Tournament does not exist.")
        except Exception as e:
            await self.error(str(e))

    async def _handle_tournament_leave(self, event):
        data = event["data"]
        try:
            await self.channel_layer.group_discard(f"tournament.{data['name']}", self.channel_name)
            self.room = None
            tournament = await sync_to_async(Tournament.objects.get)(name=data["name"])
            tournament.players.remove(self.username)
            await sync_to_async(tournament.save)()
            data["author"] = self.username
            await self.channel_layer.group_send(f"tournament.{data['name']}", {"type": MessageType.Tournament.LEAVE, "data": data})
        except Exception as e:
            await self.error(str(e))

    async def _handle_tournament_start(self, event):
        data = event["data"]
        try:
            tournament = await sync_to_async(Tournament.objects.get)(name=data["name"])
            if tournament.owner != UUID(self.user_id):
                await self.error("You are not the author of this tournament.")
                return
            tournament.status = Tournament.Status.PLAYING
            await sync_to_async(tournament.save)()
            await self.channel_layer.group_send(f"tournament.{data['name']}", {"type": MessageType.Tournament.START, "data": data})
        except Tournament.DoesNotExist:
            await self.error("Tournament does not exist.")
        except Exception as e:
            await self.error(str(e))

    async def _handle_tournament_delete(self, event):
        data = event["data"]
        try:
            tournament = await sync_to_async(Tournament.objects.get)(name=data["name"])
            if tournament.owner != UUID(self.user_id):
                await self.error("You are not the author of this tournament.")
                return
            await sync_to_async(tournament.delete)()
            await self.channel_layer.group_discard(f"tournament.{data['name']}", self.channel_name)
        except Tournament.DoesNotExist:
            await self.error("Tournament does not exist.")
        except Exception as e:
            await self.error(str(e))

    async def _handle_leave_room(self, event):
        data = event["data"]
        try:
            await self.channel_layer.group_discard(f"room.{data['name']}", self.channel_name)
            self.room = None
            data["author"] = self.username
            room = await sync_to_async(Room.objects.get)(name=data["name"])
            room.players.remove(self.username)
            await sync_to_async(room.save)()
            await self.channel_layer.group_send(f"room.{data['name']}", {"type": MessageType.Room.LEAVE, "data": data})
        except Exception as e:
            await self.error(str(e))

    async def _handle_delete_room(self, event):
        data = event["data"]
        try:
            room = await sync_to_async(Room.objects.get)(name=data["name"])
            if room.owner != UUID(self.user_id):
                await self.error("You are not the author of this room.")
                return
            await sync_to_async(room.delete)()
            await self.channel_layer.group_discard(f"room.{data['name']}", self.channel_name)
        except Room.DoesNotExist:
            await self.error("Room does not exist.")
        except Exception as e:
            await self.error(str(e))

    async def _handle_room_start(self, event):
        data = event["data"]
        try:
            room = await sync_to_async(Room.objects.get)(name=data["name"])
            if room.owner != self.user_id:
                await self.error("You are not the author of this room.")
                return
            room.status = Room.Status.PLAYING
            await sync_to_async(room.save)()
            await self.channel_layer.group_send(f"room.{data['name']}", {"type": MessageType.Room.START, "data": data})
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

    async def room_start(self, event):
        logger.info(f"[{self.username}] Room start: {event['data']}")
        await self.send(json.dumps(("room.start", event["data"])))

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

    async def tournament_create(self, event):
        logger.info(f"[{self.username}] Tournament create: {event['data']}")
        await self.send(json.dumps(("tournament.create", event["data"])))

    async def tournament_join(self, event):
        logger.info(f"[{self.username}] Tournament join: {event['data']}")
        await self.send(json.dumps(("tournament.join", event["data"])))
    
    async def tournament_leave(self, event):
        logger.info(f"[{self.username}] Tournament leave: {event['data']}")
        await self.send(json.dumps(("tournament.leave", event["data"])))
    
    async def tournament_start(self, event):
        logger.info(f"[{self.username}] Tournament start: {event['data']}")
        await self.send(json.dumps(("tournament.start", event["data"])))

    """utils"""
    async def leave_rooms(self):
        user_owned_tournaments = await sync_to_async(get_user_tournaments)(self.user_id)
        for tournament in user_owned_tournaments:
            await self._handle_tournament_delete({"data": {"name": tournament.name}})
        
        user_tournaments = await sync_to_async(get_user_playing_tournaments)(self.user_id)
        for tournament in user_tournaments:
            await self._handle_tournament_leave({"data": {"name": tournament.name}})

def get_user_rooms(user_id):
    return list(Room.objects.filter(owner=user_id))

def get_user_tournaments(user_id):
    return list(Tournament.objects.filter(owner=user_id))

def get_user_playing_rooms(user_id):
    return list(Room.objects.filter(players__contains=user_id))

def get_user_playing_tournaments(user_id):
    return list(Tournament.objects.filter(players__contains=user_id))