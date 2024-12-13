from game import Room
import neat
import os
import pickle
import time

WIN_WIDTH = 800
WIN_HEIGHT = 600
FPS = 60

class GameInstance:
	def __init__(self, room_name, config):
		self.game = Room('ai')
		# self.paddle_left = self.game.paddle_left
		# self.paddle_right = self.game.paddle_right
		# self.ball = self.game.ball
		self.key_pressed = self.game.keys_pressed
		# self.prev_time = time.time()
		self.paddle_left_x = self.game.paddle_left.x
		self.paddle_left_y = self.game.paddle_left.y
		self.paddle_right_x = self.game.paddle_right.x
		self.paddle_right_y = self.game.paddle_right.y
		self.ball_x = self.game.ball.x
		self.ball_y = self.game.ball.y
		# self.ball_dx = self.game.ball.dx
		# self.ball_dy = self.game.ball.dy
		self.loops_done = 0

	def update_bot(self):
		self.paddle_left_x = self.game.paddle_left.x
		self.paddle_left_y = self.game.paddle_left.y
		self.paddle_right_x = self.game.paddle_right.x
		self.paddle_right_y = self.game.paddle_right.y
		self.ball_x = self.game.ball.x
		self.ball_y = self.game.ball.y
		# self.ball_dx = self.game.ball.dx
		# self.ball_dy = self.game.ball.dy

	def eval_genomes(self, genome1, genome2, config):
		ai1 = neat.nn.FeedForwardNetwork.create(genome1, config)
		ai2 = neat.nn.FeedForwardNetwork.create(genome2, config)

		while True:
			# time_passed = time.time() - self.prev_time
			# if time_passed >= 1:
			if self.loops_done >= 60:
				self.game.ball.MAX_VELOCITY *= 1.05
				self.update_bot()
				self.loops_done = 0
				# self.prev_time = time.time()

			# self.key_pressed['move_left_up'] = False
			# self.key_pressed['move_left_down'] = False
			self.game.keys_pressed['move_left_up'] = False
			self.game.keys_pressed['move_left_down'] = False

			# output1 = ai1.activate((self.paddle_left.y, self.ball.y, abs(self.paddle_left.x - self.ball.x)))
			output1 = ai1.activate((self.paddle_left_y, self.ball_y, abs(self.paddle_left_x - self.ball_x)))#, self.ball_dx, self.ball_dy))
			decision1 = output1.index(max(output1))

			if decision1 == 0:
				pass
			elif decision1 == 1:
				# self.key_pressed['move_left_up'] = True
				self.game.keys_pressed['move_left_up'] = True
			elif decision1 == 2:
				# self.key_pressed['move_left_down'] = True
				self.game.keys_pressed['move_left_down'] = True

			# self.key_pressed['move_right_up'] = False
			# self.key_pressed['move_right_down'] = False
			self.game.keys_pressed['move_right_up'] = False
			self.game.keys_pressed['move_right_down'] = False

			# output2 = ai2.activate((self.paddle_right.y, self.ball.y, abs(self.paddle_right.x - self.ball.x)))
			output2 = ai2.activate((self.paddle_right_y, self.ball_y, abs(self.paddle_right_x - self.ball_x)))#, self.ball_dx, self.ball_dy))
			decision2 = output2.index(max(output2))

			if decision2 == 0:
				pass
			elif decision2 == 1:
				# self.key_pressed['move_right_up'] = True
				self.game.keys_pressed['move_right_up'] = True
			elif decision2 == 2:
				# self.key_pressed['move_right_down'] = True
				self.game.keys_pressed['move_right_down'] = True

			game_info = self.game.loop()

			if game_info.left_score >= 1 or game_info.right_score >= 1 or game_info.left_hits >= 50:
				self.calculate_fitness(genome1, genome2, game_info)
				break

			self.loops_done += 1

			# time.sleep(1 / FPS)

	def calculate_fitness(self, genome1, genome2, game_info):
		genome1.fitness += game_info.left_hits
		genome2.fitness += game_info.right_hits

def train_ai(genomes, config):
	for i, (genome_id1, genome1) in enumerate(genomes):
		if i == len(genomes) - 1:
			break

		genome1.fitness = 0
		for genome_id2, genome2 in genomes[i + 1:]:
			if genome2.fitness is None:
				genome2.fitness = 0
			game_instance = GameInstance('ai', config)
			game_instance.eval_genomes(genome1, genome2, config)

def run_neat(config):
	# checkpoint_path = os.path.join(os.path.dirname(__file__), 'training_checkpoints', 'generation-24')
	# pop = neat.Checkpointer.restore_checkpoint(checkpoint_path)
	pop = neat.Population(config)
	pop.add_reporter(neat.StdOutReporter(True))
	stats = neat.StatisticsReporter()
	pop.add_reporter(stats)
	pop.add_reporter(neat.Checkpointer(25, filename_prefix=os.path.join(os.path.dirname(__file__), 'training_checkpoints', 'generation-')))

	winner = pop.run(train_ai, 50)
	winner_path = os.path.join(os.path.dirname(__file__), 'bots', 'new.pkl')
	with open(winner_path, 'wb') as f:
		pickle.dump(winner, f)

if __name__ == '__main__':
	local_dir = os.path.dirname(__file__)
	config_path = os.path.join(local_dir, 'config.txt')
	config = neat.config.Config(neat.DefaultGenome, neat.DefaultReproduction,
								neat.DefaultSpeciesSet, neat.DefaultStagnation,
								config_path)
	run_neat(config)
