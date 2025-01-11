from channels.generic.websocket import AsyncWebsocketConsumer
from .enums import MessageType
from .serializers import TournamentSerializer
from asgiref.sync import sync_to_async
from .models import Tournament
from typing import Dict, Any
from rest_framework.exceptions import ValidationError
from django.db.models import Q
import datetime
import random
from uuid import UUID
import logging
import json
import os

logger = logging.getLogger(__name__)


class TournamentConsumer(AsyncWebsocketConsumer):
    list = []
    def __init__(self, *args, **kwargs):
        self.user_id = None
        self.username = None
        self.room = None
        super().__init__(*args, **kwargs)

    async def connect(self):
        """Establish WebSocket connection and set up user context."""
        try:
            self.user_id = self.scope["user"]["id"]
            self.username = self.scope["user"]["username"]
            self.alias = self.scope["user"]["alias"]

            logger.info(f"[{self.username}] Connected to WebSocket.")
            await self.channel_layer.group_add(f"user.{self.username}", self.channel_name)
            await self.accept()
        except Exception as e:
            logger.error(f"Connection setup failed: {e}")
            await self.close(code=3000)

    async def disconnect(self, close_code):
        try:
            if self.username:
                logger.info(f"[{self.username}] Disconnecting. ({close_code})")
                await self._handle_matchmaking_leave({"data": {"author": self.username}})
                await self.leave_tournaments()
        except Exception as e:
            logger.error(f"Disconnection cleanup failed: {e}")

    async def receive(self, text_data):
        try:
            event = json.loads(text_data)
            handler_map = {
                MessageType.Tournament.CREATE: self._handle_tournament_create,
                MessageType.Tournament.JOIN: self._handle_tournament_join,
                MessageType.Tournament.LEAVE: self._handle_tournament_leave,
                MessageType.Tournament.START: self._handle_tournament_start,
                MessageType.Tournament.DELETE: self._handle_tournament_delete,
                MessageType.Matchmaking.JOIN: self._handle_matchmaking_join,
                MessageType.Matchmaking.LEAVE: self._handle_matchmaking_leave,
            }

            handler = handler_map.get(event["type"])
            if not handler:
                await self.error(f"Unsupported message type: {event['type']}")
                return

            await handler(event)
        except json.JSONDecodeError:
            await self.error("Invalid JSON format")
        except KeyError:
            await self.error("Missing message type")
        except Exception as e:
            await self.error(f"Message processing error: {str(e)}")

    async def _handle_matchmaking_join(self, event):
        try:
            data = event.get("data", {})
            player = data["author"]
            if player is None:
                await self.error("Player name is required")
                return
            self.list.append(player)
            if (len(self.list) >= 2):
                room_code = "mm_" + os.urandom(4).hex()
                await self.channel_layer.group_send(
                    f"user.{self.list[0]}",
                    {
                        "type": MessageType.Matchmaking.START,
                        "data": {
                            "player_1": self.list[0],
                            "player_2": self.list[1],
                            "room_code": room_code
                        }
                    }
                )
                await self.channel_layer.group_send(
                    f"user.{self.list[1]}",
                    {
                        "type": MessageType.Matchmaking.START,
                        "data": {
                            "player_1": self.list[0],
                            "player_2": self.list[1],
                            "room_code": room_code
                        }
                    }
                )
                self.list.remove(self.list[1])
                self.list.remove(self.list[0])
        except Exception as e:
            await self.error(f"Matchmaking join failed: {str(e)}")

    async def _handle_matchmaking_leave(self, event):
        try:
            data = event.get("data", {})
            player = data["author"]
            if player is None:
                await self.error("Player name is required")
                return
            self.list.remove(player)
        except Exception as e:
            await self.error(f"Matchmaking leave failed: {str(e)}")

    async def _handle_tournament_create(self, event):
        try:
            existing_active = await sync_to_async(Tournament.objects.filter)(
                Q(owner=self.user_id) &
                Q(status__in=[Tournament.Status.PENDING, Tournament.Status.PLAYING])
            )
            if await sync_to_async(existing_active.count)():
                await self.error("You already have an active tournament.")
                return

            data = event.get("data", {})
            data["owner"] = self.user_id
            data["players"] = [self.username]

            serializer = TournamentSerializer(data=data)
            await sync_to_async(serializer.is_valid)(raise_exception=True)
            tournament = await sync_to_async(serializer.save)()
            await self.channel_layer.group_add(f"tournament.{tournament.name}", self.channel_name)
            self.room = tournament.name
            await self.channel_layer.group_send(f"tournament.{tournament.name}", { "type": MessageType.Tournament.CREATE, "data": serializer.data })

        except ValidationError as ve:
            await self.error(f"Invalid tournament data: {ve.detail.get('name')[0].title()}")
        except Exception as e:
            await self.error(f"Tournament creation failed: {str(e)}")

    async def _handle_tournament_join(self, event):
        try:
            logger.info(f"[{self.username}] Joining tournament")
            data = event.get("data", {})
            tournament_name = data.get("name")
            if not tournament_name:
                await self.error("Tournament name is required")
                return

            existing_tournament = await sync_to_async(
                Tournament.objects.filter(
                    Q(players__contains=self.username) &
                    Q(status__in=[Tournament.Status.PENDING, Tournament.Status.PLAYING])
                ).first
            )()
            if existing_tournament:
                await self.error(f"Already in an active tournament: {existing_tournament.name}")
                return

            tournament = await sync_to_async(
                Tournament.objects.filter(status=Tournament.Status.PENDING).get
            )(name=tournament_name)

            if len(tournament.players) >= 4:
                await self.error("Tournament is full")
                return

            if self.username in tournament.players:
                await self.error("Already in this tournament")
                return

            tournament.players.append(self.username)
            await sync_to_async(tournament.save)()

            await self.channel_layer.group_add(f"tournament.{tournament_name}", self.channel_name)
            self.room = tournament_name

            await self.channel_layer.group_send(
                f"tournament.{tournament_name}",
                {
                    "type": MessageType.Tournament.JOIN,
                    "data": {
                        "name": tournament_name,
                        "players": tournament.players
                    }
                }
            )
        except Tournament.DoesNotExist:
            await self.error("Tournament not found")
        except Exception as e:
            await self.error(f"Tournament join failed: {str(e)}")

    async def _handle_tournament_leave(self, event):
        try:
            data = event.get("data", {})
            tournament_name = data.get("name")
            if not tournament_name:
                await self.error("Tournament name is required")
                return

            tournament = await sync_to_async(Tournament.objects.exclude(status=Tournament.Status.CANCELLED).exclude(status=Tournament.Status.FINISHED).get)(name=tournament_name)
            if self.username not in tournament.players:
                await self.error("Not in this tournament")
                return

            tournament.players.remove(self.username)

            if not tournament.players:
                tournament.status = Tournament.Status.CANCELLED

            await sync_to_async(tournament.save)()

            await self.channel_layer.group_send(
                f"tournament.{tournament_name}",
                {
                    "type": MessageType.Tournament.LEAVE,
                    "data": {
                        "name": tournament_name,
                        "players": tournament.players,
                    }
                }
            )
            await self.channel_layer.group_discard(f"tournament.{tournament_name}", self.channel_name)
            self.room = None

        except Tournament.DoesNotExist:
            await self.error("Tournament not found")
        except Exception as e:
            await self.error(f"Tournament leave failed: {str(e)}")

    async def _handle_tournament_start(self, event):
        try:
            logger.info(f"[{self.username}] Starting tournament")
            data = event.get("data", {})
            tournament_name = data.get("name")

            if not tournament_name:
                await self.error("Tournament name is required")
                return

            tournament = await sync_to_async(Tournament.objects.exclude(status=Tournament.Status.CANCELLED).exclude(status=Tournament.Status.FINISHED).get)(name=tournament_name)

            if tournament.owner != UUID(self.user_id):
                await self.error("Only the tournament owner can start the tournament")
                return

            if tournament.status != Tournament.Status.PENDING:
                await self.error("Tournament cannot be started")
                return

            if len(tournament.players) < 4:
                await self.error("Minimum 4 players required")
                return
            tournament.round = Tournament.Round.FIRST
            seed = [0, 1, 2, 3]
            random.shuffle(seed)
            tournament.matches = [
                {
                    "round": tournament.round,
                    "matches": [
                        {
                            "player1": tournament.players[seed[0]],
                            "player2": tournament.players[seed[1]],
                            "room_code": "t_" + os.urandom(4).hex(),
                            "status": tournament.Status.PENDING,
                            "score": [0, 0],
                            "winner": None
                        },
                        {
                            "player1": tournament.players[seed[2]],
                            "player2": tournament.players[seed[3]],
                            "room_code": "t_" + os.urandom(4).hex(),
                            "status": tournament.Status.PENDING,
                            "score": [0, 0],
                            "winner": None
                        }
                    ]
                }
            ]
            tournament.status = Tournament.Status.PLAYING

            await sync_to_async(tournament.save)()
            await self.channel_layer.group_send(
                f"tournament.{tournament_name}",
                {
                    "type": MessageType.Tournament.START,
                    "data": {
                        "name": tournament_name,
                        "players": tournament.players,
                        "rounds": tournament.matches
                    }
                }
            )


        except Tournament.DoesNotExist:
            await self.error("Tournament not found")
        except Exception as e:
            await self.error(f"Tournament start failed: {str(e)}")

    async def _handle_tournament_update(self, event):
        try:
            data = event.get("data", {})

            if await sync_to_async(get_user_playing_tournaments)(data["player_1"]) != await sync_to_async(get_user_playing_tournaments)(data["player_2"]):
                await self.error("Players are not in the same tournament")
                return
            tournament = await sync_to_async(get_user_playing_tournaments)(data["player_1"])

            if tournament.status != Tournament.Status.PLAYING:
                await self.error("Tournament is not in playing status")
                return

            if tournament.round == Tournament.Round.FIRST:
                for i in range(len(tournament.matches[0]["matches"])):
                    if set([data["player_1"], data["player_2"]]) == set([tournament.matches[0]["matches"][i]["player1"], tournament.matches[0]["matches"][i]["player2"]]):
                        tournament.matches[0]["matches"][i]["status"] = tournament.Status.FINISHED
                        tournament.matches[0]["matches"][i]["winner"] = data["player_1"] if data["score"][0] > data["score"][1] else data["player_2"]
                        tournament.matches[0]["matches"][i]["score"] = data["score"]
                        break

                if all(game["status"] == Tournament.Status.FINISHED for game in tournament.matches[0]["matches"]):
                    tournament.round = Tournament.Round.FINAL
                    seed = [0, 1]
                    random.shuffle(seed)
                    tournament.matches.append(
                        {
                            "round": tournament.round,
                            "matches": [
                                {
                                    "player1": tournament.matches[0]["matches"][seed[0]]["winner"],
                                    "player2": tournament.matches[0]["matches"][seed[1]]["winner"],
                                    "room_code": "t_" + os.urandom(4).hex(),
                                    "status": tournament.Status.PENDING,
                                    "score": [0, 0],
                                    "winner": None
                                }
                            ]
                        }
                    )
            else:
                for i in range(len(tournament.matches[1]["matches"])):
                    if set([data["player_1"], data["player_2"]]) == set([tournament.matches[1]["matches"][i]["player1"], tournament.matches[1]["matches"][i]["player2"]]):
                        tournament.matches[1]["matches"][i]["status"] = tournament.Status.FINISHED
                        tournament.matches[1]["matches"][i]["winner"] = data["player_1"] if data["score"][0] > data["score"][1] else data["player_2"]
                        tournament.matches[1]["matches"][i]["score"] = data["score"]
                        break

                if all(game["status"] == Tournament.Status.FINISHED for game in tournament.matches[1]["matches"]):
                    tournament.status = Tournament.Status.FINISHED

            await sync_to_async(tournament.save)()

            await self.channel_layer.group_send(
                f"tournament.{tournament.name}",
                {
                    "type": MessageType.Tournament.UPDATE,
                    "data": {
                        "name": tournament.name,
                        "rounds": tournament.matches
                    }
                }
            )

        except Tournament.DoesNotExist:
            await self.error("Tournament not found")
        except Exception as e:
            await self.error(f"Tournament update failed: {str(e)}")

    async def _handle_tournament_delete(self, event):
        try:
            data = event.get("data", {})
            tournament_name = data.get("name")
            if not tournament_name:
                await self.error("Tournament name is required")
                return
            tournament = await sync_to_async(Tournament.objects.get)(name=tournament_name)

            if tournament.owner != UUID(self.user_id):
                await self.error("Only the tournament owner can delete the tournament")
                return

            if tournament.status in [Tournament.Status.PLAYING, Tournament.Status.FINISHED, Tournament.Status.CANCELLED]:
                await self.error("Cannot delete an ongoing or completed tournament")
                return

            await self.channel_layer.group_send(
                f"tournament.{tournament_name}",
                {
                    "type": MessageType.Tournament.DELETE,
                    "data": {
                        "name": tournament_name,
                        "reason": "Tournament deleted by owner"
                    }
                }
            )

            await sync_to_async(tournament.delete)()

            await self.channel_layer.group_discard(f"tournament.{tournament_name}", self.channel_name)
        except Tournament.DoesNotExist:
            await self.error("Tournament not found")
        except Exception as e:
            await self.error(f"Tournament deletion failed: {str(e)}")

    """
    Default routing methods
    """

    async def matchmaking_start(self, event):
        logger.info(f"[{self.username}] Matchmaking start: {event['data']}")
        await self._json_send(MessageType.Matchmaking.START, event["data"])

    async def tournament_create(self, event):
        logger.info(f"[{self.username}] Tournament create: {event['data']}")
        await self._json_send(MessageType.Tournament.CREATE, event["data"])

    async def tournament_join(self, event):
        logger.info(f"[{self.username}] Tournament join: {event['data']}")
        try:
            tournament_name = event["data"]["name"]
            tournament = await sync_to_async(Tournament.objects.filter(status=Tournament.Status.PENDING).get)(name=tournament_name)
            if UUID(self.user_id) == tournament.owner and len(tournament.players) >= 4:
                await self._handle_tournament_start(event)
        except Tournament.DoesNotExist:
            await self.error("Tournament not found")
        await self._json_send(MessageType.Tournament.JOIN, event["data"])

    async def tournament_leave(self, event):
        logger.info(f"[{self.username}] Tournament leave: {event['data']}")
        await self._json_send(MessageType.Tournament.LEAVE, event["data"])

    async def tournament_start(self, event):
        logger.info(f"[{self.username}] Tournament start: {event['data']}")
        event["data"]["author"] = self.username
        await self._json_send(MessageType.Tournament.START, event["data"])

    async def tournament_result(self, event):
        logger.info(f"[{self.username}] Tournament result: {event['data']}\n")
        await self._handle_tournament_update(event)

    async def tournament_update(self, event):
        logger.info(f"[{self.username}] Tournament update: {event['data']}\n")
        event["data"]["author"] = self.username
        await self._json_send(MessageType.Tournament.UPDATE, event["data"])

    async def tournament_delete(self, event):
        logger.info(f"[{self.username}] Tournament delete: {event['data']}")
        await self._json_send(MessageType.Tournament.DELETE, event["data"])

    async def leave_tournaments(self):
        logger.info(f"[{self.username}] Leaving all tournaments")
        user_owned_tournaments = await sync_to_async(get_user_owned)(self.user_id)
        for tournament in user_owned_tournaments:
            logger.info(f"[{self.username}] Deleting tournament: {tournament.name}")
            await self._handle_tournament_delete({"data": {"name": tournament.name}})

        user_tournaments = await sync_to_async(get_user_tournaments)(self.username)
        for tournament in user_tournaments:
            logger.info(f"[{self.username}] Leaving tournament: {tournament.name}")
            await self._handle_tournament_leave({"data": {"name": tournament.name}})

    async def error(self, error_message):
        logger.error(f"[{self.username}] Error: {error_message}")
        await self.send(json.dumps({"type": "error", "message": error_message}))

    async def _json_send(self, message_type: str, data: Dict[str, Any]):
        data["created_at"] = datetime.datetime.now().strftime("%H:%M")
        try:
            message = json.dumps({"type": message_type, "data": data})
            await self.send(text_data=message)
        except json.JSONDecodeError as e:
            await self.error(f"Invalid JSON format. ({e})")


def get_user_owned(user_id):
    return list(Tournament.objects.filter(owner=user_id).filter(status=Tournament.Status.PENDING))

def get_user_tournaments(username):
    return list(Tournament.objects.filter(players__contains=username).filter(status=Tournament.Status.PENDING))

def get_user_playing_tournaments(username):
    return Tournament.objects.filter(players__contains=username).filter(status=Tournament.Status.PLAYING).first()