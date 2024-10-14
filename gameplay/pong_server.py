import asyncio
import websockets
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
        self.x_vel = random.choice([-1, 1]) * self.MAX_VELOCITY
        self.y_vel = 0

    def move(self):
        self.x += self.x_vel
        self.y += self.y_vel

    def reset(self):
        self.x = self.base_x
        self.y = self.base_y
        self.x_vel = -self.x_vel
        self.y_vel = 0

paddle_left = Paddle(10, WIN_HEIGHT // 2 - PADDLE_HEIGHT // 2, PADDLE_WIDTH, PADDLE_HEIGHT)
paddle_right = Paddle(WIN_WIDTH - PADDLE_WIDTH - 10, WIN_HEIGHT // 2 - PADDLE_HEIGHT // 2, PADDLE_WIDTH, PADDLE_HEIGHT)
ball = Ball(WIN_WIDTH // 2, WIN_HEIGHT // 2, BALL_RADIUS)
score = [0, 0]

def handle_collision(ball, paddle_left, paddle_right):
    # wall collision
    if ball.y - ball.radius <= 0 or ball.y + ball.radius >= WIN_HEIGHT:
        ball.y_vel = -ball.y_vel

    # paddle collision
    if ball.x_vel < 0:
        if (paddle_left.y <= ball.y + ball.radius * 2 / 3 and ball.y <= paddle_left.y + paddle_left.height and
            ball.x - ball.radius <= paddle_left.x + paddle_left.width):
                ball.x_vel = -ball.x_vel
                y_mid = paddle_left.y + paddle_left.height // 2
                y_diff = ball.y - y_mid
                bounce_mod = (paddle_left.height // 2) // ball.MAX_VELOCITY
                ball.y_vel = y_diff // bounce_mod
    else:
        if (paddle_right.y <= ball.y + ball.radius * 2 / 3 and ball.y <= paddle_right.y + paddle_right.height and
            ball.x + ball.radius >= paddle_right.x):
                ball.x_vel = -ball.x_vel
                y_mid = paddle_right.y + paddle_right.height // 2
                y_diff = ball.y - y_mid
                bounce_mod = (paddle_right.height // 2) // ball.MAX_VELOCITY
                ball.y_vel = y_diff // bounce_mod

def update_score(score, ball):
    if ball.x < 0:
        score[1] += 1
        ball.reset()
    elif ball.x > WIN_WIDTH:
        score[0] += 1
        ball.reset()

async def handle_input(websocket):
    global keys_pressed
    async for input in websocket:
        command = json.loads(input)
        if "move_left_up" in command:
            keys_pressed["move_left_up"] = command["move_left_up"]
        if "move_left_down" in command:
            keys_pressed["move_left_down"] = command["move_left_down"]
        if "move_right_up" in command:
            keys_pressed["move_right_up"] = command["move_right_up"]
        if "move_right_down" in command:
            keys_pressed["move_right_down"] = command["move_right_down"]

async def update_game_state(websocket):
    while True:
        if keys_pressed["move_left_up"] and paddle_left.y - paddle_left.SPEED > 0:
            paddle_left.move(True)
        if keys_pressed["move_left_down"] and paddle_left.y + paddle_left.height + paddle_left.SPEED < WIN_HEIGHT:
            paddle_left.move(False)
        if keys_pressed["move_right_up"] and paddle_right.y - paddle_right.SPEED > 0:
            paddle_right.move(True)
        if keys_pressed["move_right_down"] and paddle_right.y + paddle_right.height + paddle_right.SPEED < WIN_HEIGHT:
            paddle_right.move(False)

        ball.move()
        handle_collision(ball, paddle_left, paddle_right)
        update_score(score, ball)

        game_state = {
            "paddle_left": {"x": paddle_left.x, "y": paddle_left.y},
            "paddle_right": {"x": paddle_right.x, "y": paddle_right.y},
            "ball": {"x": ball.x, "y": ball.y},
            "score": score
        }
        await websocket.send(json.dumps(game_state))
        await asyncio.sleep(1 / FPS)

async def update(websocket, path):
    consumer_task = asyncio.ensure_future(handle_input(websocket))
    producer_task = asyncio.ensure_future(update_game_state(websocket))
    done, pending = await asyncio.wait(
        [consumer_task, producer_task],
        return_when=asyncio.FIRST_COMPLETED,
    )
    for task in pending:
        task.cancel()

start_server = websockets.serve(update, "localhost", 6789)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
