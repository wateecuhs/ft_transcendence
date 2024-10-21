import json
import random
from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio

WIN_WIDTH = 800
WIN_HEIGHT = 600
PADDLE_WIDTH = 20
PADDLE_HEIGHT = 100
BALL_RADIUS = 10
FPS = 60

keys_pressed = {
    "move_left_up": False,
    "move_left_down": False,
    "move_right_up": False,
    "move_right_down": False
}

class Paddle:
    SPEED = 6

    def __init__(self, x, y, width, height):
        self.x = x
        self.y = y
        self.width = width
        self.height = height

    def move(self, up):
        self.y -= self.SPEED if up else -self.SPEED

class Ball:
    MAX_VELOCITY = 6

    def __init__(self, x, y, radius):
        self.x = self.base_x = x
        self.y = self.base_y = y
        self.radius = radius
        self.x_vel = random.choice([-1, 1]) * self.MAX_VELOCITY
        self.y_vel = 0

    def move(self):
        self.x += self.x_vel
        self.y += self.y_vel

    def reset(self):
        self.x = self.base_x
        self.y = self.base_y
        self.x_vel = random.choice([-1, 1]) * self.MAX_VELOCITY
        self.y_vel = 0

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.paddle_left = Paddle(10, WIN_HEIGHT // 2 - PADDLE_HEIGHT // 2, PADDLE_WIDTH, PADDLE_HEIGHT)
        self.paddle_right = Paddle(WIN_WIDTH - PADDLE_WIDTH - 10, WIN_HEIGHT // 2 - PADDLE_HEIGHT // 2, PADDLE_WIDTH, PADDLE_HEIGHT)
        self.ball = Ball(WIN_WIDTH // 2, WIN_HEIGHT // 2, BALL_RADIUS)
        self.score = [0, 0]
        await self.accept()
        asyncio.create_task(self.update_game_state())

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        command = json.loads(text_data)
        if "move_left_up" in command:
            keys_pressed["move_left_up"] = command["move_left_up"]
        if "move_left_down" in command:
            keys_pressed["move_left_down"] = command["move_left_down"]
        if "move_right_up" in command:
            keys_pressed["move_right_up"] = command["move_right_up"]
        if "move_right_down" in command:
            keys_pressed["move_right_down"] = command["move_right_down"]

    async def update_game_state(self):
        while True:
            if keys_pressed["move_left_up"] and self.paddle_left.y - self.paddle_left.SPEED > 0:
                self.paddle_left.move(True)
            if keys_pressed["move_left_down"] and self.paddle_left.y + self.paddle_left.height + self.paddle_left.SPEED < WIN_HEIGHT:
                self.paddle_left.move(False)
            if keys_pressed["move_right_up"] and self.paddle_right.y - self.paddle_right.SPEED > 0:
                self.paddle_right.move(True)
            if keys_pressed["move_right_down"] and self.paddle_right.y + self.paddle_right.height + self.paddle_right.SPEED < WIN_HEIGHT:
                self.paddle_right.move(False)

            self.ball.move()
            self.handle_collision()
            self.update_score()

            game_state = {
                "paddle_left": {"x": self.paddle_left.x, "y": self.paddle_left.y},
                "paddle_right": {"x": self.paddle_right.x, "y": self.paddle_right.y},
                "ball": {"x": self.ball.x, "y": self.ball.y},
                "score": self.score
            }
            await self.send(text_data=json.dumps(game_state))
            await asyncio.sleep(1 / FPS)

    def handle_collision(self):
        if self.ball.y - self.ball.radius <= 0 or self.ball.y + self.ball.radius >= WIN_HEIGHT:
            self.ball.y_vel = -self.ball.y_vel

        if self.ball.x_vel < 0:
            if (self.paddle_left.y <= self.ball.y <= self.paddle_left.y + self.paddle_left.height and
                self.ball.x - self.ball.radius <= self.paddle_left.x + self.paddle_left.width):
                    self.ball.x_vel = -self.ball.x_vel
                    y_mid = self.paddle_left.y + self.paddle_left.height // 2
                    y_diff = self.ball.y - y_mid
                    bounce_mod = (self.paddle_left.height // 2) // self.ball.MAX_VELOCITY
                    self.ball.y_vel = y_diff // bounce_mod
        else:
            if (self.paddle_right.y <= self.ball.y <= self.paddle_right.y + self.paddle_right.height and
                self.ball.x + self.ball.radius >= self.paddle_right.x):
                    self.ball.x_vel = -self.ball.x_vel
                    y_mid = self.paddle_right.y + self.paddle_right.height // 2
                    y_diff = self.ball.y - y_mid
                    bounce_mod = (self.paddle_right.height // 2) // self.ball.MAX_VELOCITY
                    self.ball.y_vel = y_diff // bounce_mod

    def update_score(self):
        if self.ball.x < 0:
            self.score[1] += 1
            self.ball.reset()
        elif self.ball.x > WIN_WIDTH:
            self.score[0] += 1
            self.ball.reset()
