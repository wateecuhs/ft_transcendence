import json
from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio
from .game import Room
import redis

WIN_WIDTH = 800
WIN_HEIGHT = 600
PADDLE_WIDTH = 20
PADDLE_HEIGHT = 100
BALL_RADIUS = 10
FPS = 60

rooms = {}

class GameConsumer(AsyncWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user = None

    async def connect(self):
        self.user = self.scope.get("user")
        if not self.user:
            print("User not authenticated", flush=True)
            await self.accept()
            await self.close(code=3000)
            return

        self.room_name = self.scope['url_route']['kwargs']['room_name']
        if self.room_name not in rooms:
            rooms[self.room_name] = Room(self.room_name)
        self.room = rooms[self.room_name]

        if not await self.room.add_player(self):
            await self.close()
            return

        await self.channel_layer.group_add(self.room_name, self.channel_name)

        if not hasattr(self.room, "game_loop"):
            self.room.game_loop = asyncio.create_task(self.update_game_state())
        await self.accept()

        if len(self.room.players) == 2:
            self.room.reset()

    async def disconnect(self, code):
        if not self.user or not self.room:
            return

        print(f"Disconnecting {self.user['username']} with code {code}", flush=True)
        await self.channel_layer.group_discard(self.room_name, self.channel_name)
        print("Players in room", [player.user for player in self.room.players], flush=True)
        if len(self.room.players) == 2:
            print("Game over because of a disconnection", flush=True)
            winner  = self.room.players[0].user["username"] if self.room.players[0] != self else self.room.players[1].user["username"]
            print("Winner is", winner, flush=True)
            game_state = await self.room.game_over(winner=winner)
            print("Game state", game_state, flush=True)
            await self.room.remove_player(self)
            print("Players in room", [player.user for player in self.room.players], flush=True)
            await self.channel_layer.group_send(
                self.room_name,
                {
                    "type": "game_update",
                    "message": json.dumps(game_state)
                }
            )
        else:
            self.room.game_loop.cancel()
            if self.room_name in rooms:
                del rooms[self.room_name]
                await self.close()

    async def receive(self, text_data):
        command = json.loads(text_data)
        if command.get('type') == 'disconnect':
            await self.disconnect(code=3000)
            return

        player_index = self.room.players.index(self)

        if "room_local" in self.room.name:
            if "move_left_up" in command:
                self.room.keys_pressed["move_left_up"] = command["move_left_up"]
            if "move_left_down" in command:
                self.room.keys_pressed["move_left_down"] = command["move_left_down"]
            if "move_right_up" in command:
                self.room.keys_pressed["move_right_up"] = command["move_right_up"]
            if "move_right_down" in command:
                self.room.keys_pressed["move_right_down"] = command["move_right_down"]
        else:
            if player_index == 0:
                if "move_left_up" in command:
                    self.room.keys_pressed["move_left_up"] = command["move_left_up"]
                if "move_left_down" in command:
                    self.room.keys_pressed["move_left_down"] = command["move_left_down"]
                if "move_right_up" in command:
                    self.room.keys_pressed["move_left_up"] = command["move_right_up"]
                if "move_right_down" in command:
                    self.room.keys_pressed["move_left_down"] = command["move_right_down"]
            if player_index == 1:
                if "move_right_up" in command:
                    self.room.keys_pressed["move_right_up"] = command["move_right_up"]
                if "move_right_down" in command:
                    self.room.keys_pressed["move_right_down"] = command["move_right_down"]
                if "move_left_up" in command:
                    self.room.keys_pressed["move_right_up"] = command["move_left_up"]
                if "move_left_down" in command:
                    self.room.keys_pressed["move_right_down"] = command["move_left_down"]

        await self.channel_layer.group_send(
            self.room_name,
            {
                "type": "game_update",
                "message": text_data
            }
        )

    async def game_update(self, event):
        await self.send(text_data=event['message'])

    async def publish_results(self):
        redis_client = redis.Redis(host='match-redis', port=6379, db=0)
        if self.name != "room_local":
            redis_client.publish('game_results', json.dumps({
                "room_name": self.room.name,
                "player_1": self.room.players[0].user["username"],
                "player_2": self.room.players[1].user["username"],
                "player_1_win": True if self.room.score[0] == 3 else False,
                "player_2_win": True if self.room.score[1] == 3 else False,
                "score": self.room.score
            }))

    async def update_game_state(self):
        while True:
            if "room_local" not in self.room.name:
                if len(self.room.players) < 2:
                    await asyncio.sleep(1 / FPS)
                    self.room.reset()
                    continue

            game_state = await self.room.update_game_state()
            await self.channel_layer.group_send(
                self.room_name,
                {
                    "type": "game_update",
                    "message": json.dumps(game_state)
                }
            )
            if game_state.get("type") == "game_over":
                self.room.players.clear()
                break
            await asyncio.sleep(1 / FPS)
