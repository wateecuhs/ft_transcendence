import asyncio
import random
import neat
import os
import pickle
import time
import json

WIN_WIDTH = 800
WIN_HEIGHT = 600
PADDLE_WIDTH = 20
PADDLE_HEIGHT = 100
BALL_RADIUS = 10
FPS = 60

class Paddle:
    SPEED = 7.0

    def __init__(self, x, y, width, height):
        self.x = x
        self.y = y
        self.width = width
        self.height = height

    def move(self, up):
        self.y -= self.SPEED if up else -self.SPEED

class Ball:
    MAX_VELOCITY = 7.0

    def __init__(self, x, y, radius):
        self.x = self.base_x = x
        self.y = self.base_y = y
        self.radius = radius
        self.dx = random.choice([-1, 1]) * self.MAX_VELOCITY
        self.dy = random.choice([-1, 1]) * self.MAX_VELOCITY
        self.serving = True
        self.prev_time = time.time()

    def move(self):
        delta_time = (time.time() - self.prev_time) * FPS
        self.prev_time = time.time()

        self.x += self.dx * delta_time
        self.y += self.dy * delta_time

    def reset(self):
        self.x = self.base_x
        self.y = self.base_y
        self.dx = random.choice([-1, 1]) * self.MAX_VELOCITY
        self.dy = random.choice([-1, 1]) * self.MAX_VELOCITY
        self.serve()

    def serve(self):
        self.serving = True
        self.dx *= 0.5
        self.dy *= 0.5

class Room:
    def __init__(self, room_name):
        self.name = room_name
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
        self.ball.serve()
        self.winner = None

    async def add_player(self, player):
        if len(self.players) < 2:
            self.players.append(player)
            self.reset()
            return True
        return False

    async def remove_player(self, player):
        if player in self.players:
            self.players.remove(player)

    def move_paddles(self):
        # async with self.lock:
        if self.keys_pressed["move_left_up"] and self.paddle_left.y - self.paddle_left.SPEED > 0:
            self.paddle_left.move(True)
        if self.keys_pressed["move_left_down"] and self.paddle_left.y + self.paddle_left.height + self.paddle_left.SPEED < WIN_HEIGHT:
            self.paddle_left.move(False)
        if self.keys_pressed["move_right_up"] and self.paddle_right.y - self.paddle_right.SPEED > 0:
            self.paddle_right.move(True)
        if self.keys_pressed["move_right_down"] and self.paddle_right.y + self.paddle_right.height + self.paddle_right.SPEED < WIN_HEIGHT:
            self.paddle_right.move(False)

    async def update_game_state(self):
        async with self.lock:
            self.move_paddles()
            self.ball.move()
            self.handle_collision()
            self.update_score()

            if self.score[0] == 10 or self.score[1] == 10:
                return self.game_over()

            game_state = {
                "paddle_left": {"x": self.paddle_left.x, "y": self.paddle_left.y},
                "paddle_right": {"x": self.paddle_right.x, "y": self.paddle_right.y},
                "ball": {"x": self.ball.x, "y": self.ball.y, "dx" : self.ball.dx, "dy": self.ball.dy},
                "score": self.score
            }
        return game_state

    def handle_collision(self):
        # Wall collision
        if self.ball.y - self.ball.radius < 0 or self.ball.y + self.ball.radius > WIN_HEIGHT:
            self.ball.dy = -self.ball.dy
            return

        # Paddle collision
        if self.ball.dx < 0:
            if (self.paddle_left.y - self.ball.radius <= self.ball.y <= self.paddle_left.y + self.paddle_left.height and
                self.ball.x - self.ball.radius <= self.paddle_left.x + self.paddle_left.width):
                self.ball.dx = -self.ball.dx
                y_mid = self.paddle_left.y + self.paddle_left.height // 2
                y_diff = self.ball.y - y_mid
                bounce_mod = (self.paddle_left.height / 2) / self.ball.MAX_VELOCITY
                self.ball.dy = y_diff / bounce_mod
                if self.ball.serving:
                    self.ball.serving = False
                    self.ball.dx *= 2
                    self.ball.dy *= 2
        else:
            if (self.paddle_right.y - self.ball.radius <= self.ball.y <= self.paddle_right.y + self.paddle_right.height and
                self.ball.x + self.ball.radius >= self.paddle_right.x):
                self.ball.dx = -self.ball.dx
                y_mid = self.paddle_right.y + self.paddle_right.height // 2
                y_diff = self.ball.y - y_mid
                bounce_mod = (self.paddle_right.height / 2) / self.ball.MAX_VELOCITY
                self.ball.dy = y_diff / bounce_mod
                if self.ball.serving:
                    self.ball.serving = False
                    self.ball.dx *= 2
                    self.ball.dy *= 2

    def update_score(self):
        if self.ball.x < 0:
            self.score[1] += 1
            self.ball.reset()
            self.ball.MAX_VELOCITY *= 1.025
        elif self.ball.x > WIN_WIDTH:
            self.score[0] += 1
            self.ball.reset()
            self.ball.MAX_VELOCITY *= 1.025

    def game_over(self):
        if self.score[0] == 10:
            self.winner = "Player 1"
        else:
            self.winner = "Player 2"

        game_state = {
            "paddle_left": {"x": self.paddle_left.x, "y": self.paddle_left.y},
            "paddle_right": {"x": self.paddle_right.x, "y": self.paddle_right.y},
            "ball": {"x": self.ball.x, "y": self.ball.y, "dx" : self.ball.dx, "dy": self.ball.dy},
            "score": self.score,
            "winner": self.winner
        }

        return game_state
    
    def reset(self):
        self.paddle_left = Paddle(10, WIN_HEIGHT // 2 - PADDLE_HEIGHT // 2, PADDLE_WIDTH, PADDLE_HEIGHT)
        self.paddle_right = Paddle(WIN_WIDTH - PADDLE_WIDTH - 10, WIN_HEIGHT // 2 - PADDLE_HEIGHT // 2, PADDLE_WIDTH, PADDLE_HEIGHT)
        self.ball.reset()
        self.score = [0, 0]


