import asyncio
import random
from redis.asyncio import Redis
import json
from channels.db import database_sync_to_async
from core.asgi import pool

@database_sync_to_async
def publish_to_redis(data):
    with Redis(connection_pool=pool) as redis_client:
        return redis_client.publish('game_results', json.dumps(data))

WIN_WIDTH = 800
WIN_HEIGHT = 600
PADDLE_WIDTH = 20
PADDLE_HEIGHT = 100
BALL_RADIUS = 10
FPS = 60

class Paddle:
    SPEED = 10.0

    def __init__(self, x, y, width, height):
        self.x = x
        self.y = y
        self.width = width
        self.height = height

    def move(self, up):
        self.y -= self.SPEED if up else -self.SPEED

class Ball:
    MAX_VELOCITY = 6.0

    def __init__(self, x, y, radius):
        self.x = self.base_x = x
        self.y = self.base_y = y
        self.radius = radius
        self.dx = random.choice([-1, 1]) * self.MAX_VELOCITY
        self.dy = random.choice([-1, 1]) * self.MAX_VELOCITY
        self.serving = True

    def move(self):
        self.x += self.dx
        self.y += self.dy

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

            if self.score[0] == 3 or self.score[1] == 3:
                return await self.game_over()

            if "room_local" in self.name:
                game_state = {
                    "paddle_left": {"x": self.paddle_left.x, "y": self.paddle_left.y},
                    "paddle_right": {"x": self.paddle_right.x, "y": self.paddle_right.y},
                    "ball": {"x": self.ball.x, "y": self.ball.y, "dx" : self.ball.dx, "dy": self.ball.dy},
                    "score": self.score,
                    "players": ["", ""]
                }
            else:
                game_state = {
                    "paddle_left": {"x": self.paddle_left.x, "y": self.paddle_left.y},
                    "paddle_right": {"x": self.paddle_right.x, "y": self.paddle_right.y},
                    "ball": {"x": self.ball.x, "y": self.ball.y, "dx" : self.ball.dx, "dy": self.ball.dy},
                    "score": self.score,
                    "players": [player.user["alias"] for player in self.players]
                }

        return game_state

    def handle_collision(self):
        # wall collision
        if self.ball.y - self.ball.radius < 0 or self.ball.y + self.ball.radius > WIN_HEIGHT:
            self.ball.dy = -self.ball.dy
            return

        # paddle collision
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
                self.ball.dx *= 1.07
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
                self.ball.dx *= 1.07

    def update_score(self):
        if self.ball.x < 0:
            self.score[1] += 1
            self.ball.reset()
        elif self.ball.x > WIN_WIDTH:
            self.score[0] += 1
            self.ball.reset()

    async def game_over(self, winner=None):
        if winner is None:
            if len(self.players) == 2:
                self.winner = self.players[0].user["alias"] if self.score[0] > self.score[1] else self.players[1].user["alias"]
            else:
                self.winner = "1" if self.score[0] > self.score[1] else "2"
        else:
            self.winner = winner

        if "room_local" not in self.name:
            game_state = {
                "type": "game_over",
                "paddle_left": {"x": self.paddle_left.x, "y": self.paddle_left.y},
                "paddle_right": {"x": self.paddle_right.x, "y": self.paddle_right.y},
                "ball": {"x": self.ball.x, "y": self.ball.y, "dx" : self.ball.dx, "dy": self.ball.dy},
                "score": self.score,
                "players": [player.user["alias"] for player in self.players],
                "winner": self.winner
            }
            try:
                data = {
                        "room_name": self.name,
                        "player_1": self.players[0].user["username"],
                        "player_2": self.players[1].user["username"],
                        "player_1_win": True if self.winner == self.players[0].user["alias"] else False,
                        "player_2_win": True if self.winner == self.players[1].user["alias"] else False,
                        "score": self.score,
                        "winner": self.players[0].user["username"] if self.winner == self.players[0].user["alias"] else self.players[1].user["username"]
                    }
                redis_client = Redis(connection_pool=pool)
                await asyncio.wait_for(
                    redis_client.publish('game_results', json.dumps(data)),
                    timeout=5.0
                )
                await redis_client.close()
            except asyncio.TimeoutError:
                print("Redis publish operation timed out", flush=True)
            except Exception as e:
                print(f"Unexpected error: {e}", flush=True)
        else:
            game_state = {
                "type": "game_over",
                "paddle_left": {"x": self.paddle_left.x, "y": self.paddle_left.y},
                "paddle_right": {"x": self.paddle_right.x, "y": self.paddle_right.y},
                "ball": {"x": self.ball.x, "y": self.ball.y, "dx" : self.ball.dx, "dy": self.ball.dy},
                "score": self.score,
                "players": ["", ""],
                "winner": self.winner
            }

        return game_state

    def reset(self):
        self.paddle_left = Paddle(10, WIN_HEIGHT // 2 - PADDLE_HEIGHT // 2, PADDLE_WIDTH, PADDLE_HEIGHT)
        self.paddle_right = Paddle(WIN_WIDTH - PADDLE_WIDTH - 10, WIN_HEIGHT // 2 - PADDLE_HEIGHT // 2, PADDLE_WIDTH, PADDLE_HEIGHT)
        self.ball.reset()
        self.score = [0, 0]
