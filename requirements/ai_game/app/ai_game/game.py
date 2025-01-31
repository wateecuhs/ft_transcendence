import asyncio
import random
import neat
import os
import pickle
import time

WIN_WIDTH = 800
WIN_HEIGHT = 600
PADDLE_WIDTH = 20
PADDLE_HEIGHT = 100
BALL_RADIUS = 10
MAX_VELOCITY = 6.0
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
    MAX_VELOCITY = MAX_VELOCITY

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

class Bot:
    def __init__(self):
        self.genome = self.get_genome()
        local_dir = os.path.dirname(__file__)
        config_path = os.path.join(local_dir, 'config.txt')
        self.config = neat.config.Config(neat.DefaultGenome, neat.DefaultReproduction,
                                         neat.DefaultSpeciesSet, neat.DefaultStagnation,
                                         config_path)
        self.net = neat.nn.FeedForwardNetwork.create(self.genome, self.config)
        self.paddle_x = WIN_WIDTH - PADDLE_WIDTH - 10
        self.paddle_y = WIN_HEIGHT // 2 - PADDLE_HEIGHT // 2
        self.ball_x = WIN_WIDTH // 2
        self.ball_y = WIN_HEIGHT // 2
        self.ball_dx = 0
        self.ball_dy = 0

    def get_genome(self):
        local_dir = os.path.dirname(__file__)
        genome_path = os.path.join(local_dir, 'bots', 'hard-gen50_2.pkl')
        with open(genome_path, 'rb') as f:
            genome = pickle.load(f)
        return genome

    def update(self, paddle_y, ball_y, ball_x, ball_dx, ball_dy):
        self.paddle_y = paddle_y
        self.ball_y = ball_y
        self.ball_x = ball_x
        self.ball_dx = ball_dx
        self.ball_dy = ball_dy

    def predict(self, paddle_y):
        self.paddle_y = paddle_y

        if self.ball_y - BALL_RADIUS < 0 or self.ball_y + BALL_RADIUS > WIN_HEIGHT:
            self.ball_dy = -self.ball_dy

        if self.ball_dx < 0:
            if self.ball_x - BALL_RADIUS < PADDLE_WIDTH:
                self.ball_dx = -self.ball_dx * 1.07
        else:
            if (self.paddle_y - BALL_RADIUS <= self.ball_y <= self.paddle_y + PADDLE_HEIGHT and
                self.ball_x + BALL_RADIUS >= self.paddle_x):
                self.ball_dx = -self.ball_dx * 1.07
                y_mid = self.paddle_y + PADDLE_HEIGHT // 2
                y_diff = self.ball_y - y_mid
                bounce_mod = (PADDLE_HEIGHT / 2) / MAX_VELOCITY
                self.ball_dy = y_diff / bounce_mod

        self.ball_x += self.ball_dx
        self.ball_y += self.ball_dy

class GameInformation:
    def __init__(self, left_hits, right_hits, left_score, right_score):
        self.left_hits = left_hits
        self.right_hits = right_hits
        self.left_score = left_score
        self.right_score = right_score

class Room:
    def __init__(self, room_name):
        self.name = room_name
        self.lock = asyncio.Lock()
        self.paddle_left = Paddle(10, WIN_HEIGHT // 2 - PADDLE_HEIGHT // 2, PADDLE_WIDTH, PADDLE_HEIGHT)
        self.paddle_right = Paddle(WIN_WIDTH - PADDLE_WIDTH - 10, WIN_HEIGHT // 2 - PADDLE_HEIGHT // 2, PADDLE_WIDTH, PADDLE_HEIGHT)
        self.ball = Ball(WIN_WIDTH // 2, WIN_HEIGHT // 2, BALL_RADIUS)
        self.bot = Bot()
        self.score = [0, 0]
        self.players = []
        self.keys_pressed = {
            "move_left_up": False,
            "move_left_down": False,
            "move_right_up": False,
            "move_right_down": False
        }
        self.left_hits = 0
        self.right_hits = 0
        self.ball.serve()
        self.prev_time = time.time()
        self.winner = None

    async def add_player(self, player):
        if len(self.players) < 1:
            self.players.append(player)
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
            self.move_paddle_ai()
            self.move_paddles()
            self.ball.move()
            self.handle_collision()
            self.update_score()

            if self.score[0] == 5 or self.score[1] == 5:
                return self.game_over()

            game_state = {
                "paddle_left": {"x": self.paddle_left.x, "y": self.paddle_left.y},
                "paddle_right": {"x": self.paddle_right.x, "y": self.paddle_right.y},
                "ball": {"x": self.ball.x, "y": self.ball.y, "dx" : self.ball.dx, "dy": self.ball.dy},
                "score": self.score,
                "players": [self.players[0].user["alias"], "Ponginator-9000"]
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
                self.left_hits += 1
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
                self.right_hits += 1
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

    def game_over(self):
        if self.score[0] == 5:
            self.winner = self.players[0].user["alias"]
        else:
            self.winner = "Ponginator-9000"

        game_state = {
            "type": "game_over",
            "paddle_left": {"x": self.paddle_left.x, "y": self.paddle_left.y},
            "paddle_right": {"x": self.paddle_right.x, "y": self.paddle_right.y},
            "ball": {"x": self.ball.x, "y": self.ball.y, "dx" : self.ball.dx, "dy": self.ball.dy},
            "score": self.score,
            "players": [self.players[0].user["alias"], "Ponginator-9000"],
            "winner": self.winner
        }
        return game_state

    def move_paddle_ai(self):
        self.keys_pressed["move_right_up"] = False
        self.keys_pressed["move_right_down"] = False

        # bot gets updated once per second
        delta_time = time.time() - self.prev_time
        if delta_time >= 1:
            self.bot.update(self.paddle_right.y, self.ball.y, self.ball.x, self.ball.dx, self.ball.dy)
            self.prev_time = time.time()
        else:
            self.bot.predict(self.paddle_right.y)

        output = self.bot.net.activate((self.bot.paddle_y, self.bot.ball_y, abs(self.bot.paddle_x - self.bot.ball_x), self.bot.ball_dx, self.bot.ball_dy))
        decision = output.index(max(output))

        if decision == 0:
            pass
        elif decision == 1:
            self.keys_pressed["move_right_up"] = True
        elif decision == 2:
            self.keys_pressed["move_right_down"] = True

    # used for training purposes
    def loop(self):
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

        game_info = GameInformation(self.left_hits, self.right_hits, self.score[0], self.score[1])

        return game_info

    # can be used for training purposes, currently not used
    def reset(self):
        self.paddle_left = Paddle(10, WIN_HEIGHT // 2 - PADDLE_HEIGHT // 2, PADDLE_WIDTH, PADDLE_HEIGHT)
        self.paddle_right = Paddle(WIN_WIDTH - PADDLE_WIDTH - 10, WIN_HEIGHT // 2 - PADDLE_HEIGHT // 2, PADDLE_WIDTH, PADDLE_HEIGHT)
        self.ball.reset()
        self.score = [0, 0]
        self.left_hits = 0
        self.right_hits = 0

