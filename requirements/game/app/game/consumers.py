import json
from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio
from .game import Room

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
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        if self.room_name not in rooms:
            rooms[self.room_name] = Room(self.room_name)
        self.room = rooms[self.room_name]

        self.user = self.scope.get("user")
        if self.user:
            print(f"User connected: {self.user['username']} (ID: {self.user['id']})", flush=True)
        else:
            print("Anonymous user connected", flush=True)

        if not await self.room.add_player(self):
            await self.close()
            return

        await self.channel_layer.group_add(self.room_name, self.channel_name)

        if not hasattr(self.room, "game_loop"):
            self.room.game_loop = asyncio.create_task(self.update_game_state())
        await self.accept()

        if len(self.room.players) == 2:
            self.room.reset()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_name, self.channel_name)
        await self.room.remove_player(self)

        if len(self.room.players) == 0:
            self.room.game_loop.cancel()
            if self.room_name in rooms:
                del rooms[self.room_name]

    async def receive(self, text_data):
        # data = json.loads(text_data)
        # user = self.scope.get("user")
        # if user:
        #     data["user"] = {"id": user["id"], "username": user["username"]}

        command = json.loads(text_data)
        if command.get('type') == 'disconnect':
            print("Disconnected", flush=True)
            await self.room.remove_player(self)
            if len(self.room.players) == 0:
                self.room.game_loop.cancel()
                del rooms[self.room_name]
                await self.close()
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
            await asyncio.sleep(1 / FPS)
