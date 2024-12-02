import json
import random
from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio
from .room import Room
import os
import neat
import pickle

WIN_WIDTH = 800
WIN_HEIGHT = 600
PADDLE_WIDTH = 20
PADDLE_HEIGHT = 100
BALL_RADIUS = 10
FPS = 60

rooms = {}

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        if self.room_name not in rooms:
            rooms[self.room_name] = Room(self.room_name)
        self.room = rooms[self.room_name]

        if not await self.room.add_player(self):
            await self.close()
            return

        await self.channel_layer.group_add(self.room_name, self.channel_name)
        await self.accept()

        if not hasattr(self.room, "game_loop"):
            self.room.game_loop = asyncio.create_task(self.update_game_state())

        local_dir = os.path.dirname(__file__)
        config_path = os.path.join(local_dir, 'config.txt')
        self.config = neat.config.Config(neat.DefaultGenome, neat.DefaultReproduction,
                                         neat.DefaultSpeciesSet, neat.DefaultStagnation,
                                         config_path)
        bot_path = os.path.join(local_dir, 'bots', 'hard-gen50.pkl')
        with open(bot_path, 'rb') as f:
            self.bot = pickle.load(f)

        self.bot_nn = neat.nn.FeedForwardNetwork.create(self.bot, self.config)

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_name, self.channel_name)
        await self.room.remove_player(self)

        if len(self.room.players) == 0:
            self.room.game_loop.cancel()
            del rooms[self.room_name]

    async def receive(self, text_data):
        command = json.loads(text_data)
        player_index = self.room.players.index(self)

        if player_index == 0:
            if "move_left_up" in command:
                self.room.keys_pressed["move_left_up"] = command["move_left_up"]
            if "move_left_down" in command:
                self.room.keys_pressed["move_left_down"] = command["move_left_down"]

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
            self.room.keys_pressed["move_right_up"] = False
            self.room.keys_pressed["move_right_down"] = False

            ai_output = self.bot_nn.activate((self.room.paddle_right.y, self.room.ball.y, abs(self.room.paddle_right.x - self.room.ball.x)))
            decision = ai_output.index(max(ai_output))

            if decision == 0:
                pass
            elif decision == 1:
                self.room.keys_pressed["move_right_up"] = True
            elif decision == 2:
                self.room.keys_pressed["move_right_down"] = True

            game_state = await self.room.update_game_state()
            await self.channel_layer.group_send(
                self.room_name,
                {
                    "type": "game_update",
                    "message": json.dumps(game_state)
                }
            )
            await asyncio.sleep(1 / FPS)
