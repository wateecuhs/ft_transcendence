import pygame
import random

pygame.init()

WIN_WIDTH = 800
WIN_HEIGHT = 600
PADDLE_WIDTH = 20
PADDLE_HEIGHT = 100
BALL_RADIUS = 10

BLACK = (0, 0, 0)
WHITE = (255, 255, 255)

SCORE_FONT = pygame.font.SysFont(None, 40)

WIN = pygame.display.set_mode((WIN_WIDTH, WIN_HEIGHT))
pygame.display.set_caption("Pong")

clock = pygame.time.Clock()
FPS = 60

class Paddle:
	COLOR = WHITE
	SPEED = 5

	def __init__(self, x, y, width, height):
		self.x = x
		self.y = y
		self.width = width
		self.height = height

	def draw(self, win):
		pygame.draw.rect(win, self.COLOR, (self.x, self.y, self.width, self.height))

	def move(self, up):
		self.y -= self.SPEED if up else -self.SPEED

class Ball:
	COLOR = WHITE
	MAX_VELOCITY = 7

	def __init__(self, x, y, radius):
		self.x = self.base_x = x
		self.y = self.base_y = y
		self.radius = radius
		self.x_vel = random.choice([-1, 1]) * self.MAX_VELOCITY
		self.y_vel = 0

	def draw(self, win):
		pygame.draw.circle(win, self.COLOR, (self.x, self.y), self.radius)

	def move(self):
		self.x += self.x_vel
		self.y += self.y_vel

	def reset(self):
		self.x = self.base_x
		self.y = self.base_y
		self.x_vel = -self.x_vel
		self.y_vel = 0

def draw_window(win, paddles, ball, score):
	win.fill(BLACK)

	score_text_left = SCORE_FONT.render(f"{score[0]}", 1, WHITE)
	score_text_right = SCORE_FONT.render(f"{score[1]}", 1, WHITE)
	win.blit(score_text_left, (WIN_WIDTH // 4 - score_text_left.get_width() // 2, 10))
	win.blit(score_text_right, (WIN_WIDTH // 4 * 3 - score_text_right.get_width() // 2, 10))

	for paddle in paddles:
		paddle.draw(win)

	ball.draw(win)

	pygame.display.update()

def handle_collision(ball, paddle_left, paddle_right):
	# wall collision
	if ball.y - ball.radius <= 0 or ball.y + ball.radius >= WIN_HEIGHT:
		ball.y_vel = -ball.y_vel

	# paddle collision
	if ball.x_vel < 0:
		if (paddle_left.y <= ball.y <= paddle_left.y + paddle_left.height and
			ball.x - ball.radius <= paddle_left.x + paddle_left.width):
				ball.x_vel = -ball.x_vel

				y_mid = paddle_left.y + paddle_left.height // 2
				y_diff = ball.y - y_mid
				bounce_mod = (paddle_left.height // 2) // ball.MAX_VELOCITY
				ball.y_vel = y_diff // bounce_mod
	else:
		if (paddle_right.y <= ball.y <= paddle_right.y + paddle_right.height and
			ball.x + ball.radius >= paddle_right.x):
				ball.x_vel = -ball.x_vel

				y_mid = paddle_right.y + paddle_right.height // 2
				y_diff = ball.y - y_mid
				bounce_mod = (paddle_right.height // 2) // ball.MAX_VELOCITY
				ball.y_vel = y_diff // bounce_mod

def handle_paddle_movement(keys_pressed, paddle_left, paddle_right):
	if keys_pressed[pygame.K_w] and paddle_left.y - paddle_left.SPEED > 0:
		paddle_left.move(True)
	elif keys_pressed[pygame.K_s] and paddle_left.y + paddle_left.height + paddle_left.SPEED < WIN_HEIGHT:
		paddle_left.move(False)

	if keys_pressed[pygame.K_UP] and paddle_right.y - paddle_right.SPEED > 0:
		paddle_right.move(True)
	elif keys_pressed[pygame.K_DOWN] and paddle_right.y + paddle_right.height + paddle_right.SPEED < WIN_HEIGHT:
		paddle_right.move(False)

def update_score(score, ball):
	if ball.x < 0:
		score[1] += 1
		ball.reset()
	elif ball.x > WIN_WIDTH:
		score[0] += 1
		ball.reset()

def main():
	run = True

	paddle_left = Paddle(10, WIN_HEIGHT // 2 - PADDLE_HEIGHT // 2, PADDLE_WIDTH, PADDLE_HEIGHT)
	paddle_right = Paddle(WIN_WIDTH - PADDLE_WIDTH - 10, WIN_HEIGHT // 2 - PADDLE_HEIGHT // 2, PADDLE_WIDTH, PADDLE_HEIGHT)
	ball = Ball(WIN_WIDTH // 2, WIN_HEIGHT // 2, BALL_RADIUS)
	score = [0, 0]

	while run:
		clock.tick(FPS)
		draw_window(WIN, [paddle_left, paddle_right], ball, score)
		keys_pressed = pygame.key.get_pressed()

		for event in pygame.event.get():
			if event.type == pygame.QUIT or keys_pressed[pygame.K_ESCAPE]:
				run = False
				break

		handle_paddle_movement(keys_pressed, paddle_left, paddle_right)
		ball.move()
		handle_collision(ball, paddle_left, paddle_right)
		update_score(score, ball)

	pygame.quit()

if __name__ == "__main__":
	main()
