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

class AIGameConsumer(AsyncWebsocketConsumer):
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

    async def disconnect(self, close_code):
        if not self.user or not self.room:
            return

        await self.channel_layer.group_discard(self.room_name, self.channel_name)
        await self.room.remove_player(self)

        if len(self.room.players) == 0:
            self.room.game_loop.cancel()
            if self.room_name in rooms:
                del rooms[self.room_name]

    async def receive(self, text_data):
        command = json.loads(text_data)
        if command.get('type') == 'disconnect':
            await self.room.remove_player(self)
            self.room.game_loop.cancel()
            del rooms[self.room_name]
            await self.close()
            return

        if "move_left_up" in command:
            self.room.keys_pressed["move_left_up"] = command["move_left_up"]
        if "move_left_down" in command:
            self.room.keys_pressed["move_left_down"] = command["move_left_down"]
        if "move_right_up" in command:
            self.room.keys_pressed["move_left_up"] = command["move_right_up"]
        if "move_right_down" in command:
            self.room.keys_pressed["move_left_down"] = command["move_right_down"]

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
            game_state = await self.room.update_game_state()
            await self.channel_layer.group_send(
                self.room_name,
                {
                    "type": "game_update",
                    "message": json.dumps(game_state)
                }
            )
            await asyncio.sleep(1 / FPS)
