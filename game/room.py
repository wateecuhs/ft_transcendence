import asyncio
import json
import random

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
        self.dx = random.choice([-1, 1]) * 5
        self.dy = 0

    def move(self):
        self.x += self.dx
        self.y += self.dy

    def reset(self):
        self.x = self.base_x
        self.y = self.base_y
        self.dx = random.choice([-1, 1]) * self.MAX_VELOCITY
        self.dy = 0

class Room:
    def __init__(self, room_name):
        self.room_name = room_name
        self.lock = asyncio.Lock()
        self.paddle_left = Paddle(10, WIN_HEIGHT // 2 - PADDLE_HEIGHT // 2, PADDLE_WIDTH, PADDLE_HEIGHT)
        self.paddle_right = Paddle(WIN_WIDTH - PADDLE_WIDTH - 10, WIN_HEIGHT // 2 - PADDLE_HEIGHT // 2, PADDLE_WIDTH, PADDLE_HEIGHT)
        self.ball = Ball(WIN_WIDTH // 2, WIN_HEIGHT // 2, BALL_RADIUS)
        self.score = [0, 0]
        self.players = []
        self.keys_pressed = {
            "move_left_up": False,
            "move_left_down": False,
            "move_right_up": False,
            "move_right_down": False
        }

    async def add_player(self, player):
        if len(self.players) < 2:
            self.players.append(player)
            return True
        return False

    async def remove_player(self, player):
        if player in self.players:
            self.players.remove(player)

    async def update_game_state(self):
        async with self.lock:
            if self.keys_pressed["move_left_up"] and self.paddle_left.y - self.paddle_left.SPEED > 0:
                self.paddle_left.move(True)
            if self.keys_pressed["move_left_down"] and self.paddle_left.y + self.paddle_left.height + self.paddle_left.SPEED < WIN_HEIGHT:
                self.paddle_left.move(False)
            if self.keys_pressed["move_right_up"] and self.paddle_right.y - self.paddle_right.SPEED > 0:
                self.paddle_right.move(True)
            if self.keys_pressed["move_right_down"] and self.paddle_right.y + self.paddle_right.height + self.paddle_right.SPEED < WIN_HEIGHT:
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
            return game_state

    def handle_collision(self):
        # Wall collision
        if self.ball.y - self.ball.radius <= 0 or self.ball.y + self.ball.radius >= WIN_HEIGHT:
            self.ball.dy = -self.ball.dy

        # Paddle collision
        if self.ball.dx < 0:
            if (self.paddle_left.y <= self.ball.y <= self.paddle_left.y + self.paddle_left.height and
                self.ball.x - self.ball.radius <= self.paddle_left.x + self.paddle_left.width):
                self.ball.dx = -self.ball.dx
                y_mid = self.paddle_left.y + self.paddle_left.height // 2
                y_diff = self.ball.y - y_mid
                bounce_mod = (self.paddle_left.height // 2) // self.ball.MAX_VELOCITY
                self.ball.dy = y_diff // bounce_mod
        else:
            if (self.paddle_right.y <= self.ball.y <= self.paddle_right.y + self.paddle_right.height and
                self.ball.x + self.ball.radius >= self.paddle_right.x):
                self.ball.dx = -self.ball.dx
                y_mid = self.paddle_right.y + self.paddle_right.height // 2
                y_diff = self.ball.y - y_mid
                bounce_mod = (self.paddle_right.height // 2) // self.ball.MAX_VELOCITY
                self.ball.dy = y_diff // bounce_mod

    def update_score(self):
        if self.ball.x < 0:
            self.score[1] += 1
            self.ball.reset()
        elif self.ball.x > WIN_WIDTH:
            self.score[0] += 1
            self.ball.reset()