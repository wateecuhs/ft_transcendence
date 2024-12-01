from game import Room
import neat
import os

WIN_WIDTH = 800
WIN_HEIGHT = 600

class GameInstance:
	def __init__(self, room_name):
		self.game = Room('ai')
		self.paddle_left = self.game.paddle_left
		self.paddle_right = self.game.paddle_right
		self.ball = self.game.ball

	def test_ai(self):
		run = True
		while run:
			self.game.loop()

	def train_ai(self, genome1, genome2, config):
		ai1 = neat.nn.FeedForwardNetwork.create(genome1, config)
		ai2 = neat.nn.FeedForwardNetwork.create(genome2, config)

		run = True
		while run:
			output1 = ai1.activate(self.paddle_left.y, self.ball.y, abs(self.paddle_left.x - self.ball.x))
			decision1 = output1.index(max(output1))

			if decision1 == 0:
				pass
			elif decision1 == 1:
				self.key_pressed['move_left_up'] = True
			elif decision1 == 2:
				self.key_pressed['move_left_down'] = True

			output2 = ai2.activate(self.paddle_right.y, self.ball.y, abs(self.paddle_right.x - self.ball.x))
			decision2 = output2.index(max(output2))

			if decision2 == 0:
				pass
			elif decision2 == 1:
				self.key_pressed['move_right_up'] = True
			elif decision2 == 2:
				self.key_pressed['move_right_down'] = True

			game_info = self.game.loop()

			if game_info.left_score >= 1 or game_info.right_score >= 1 or game_info.left_hits >= 50:
				genome1.fitness = game_info.left_score
				genome2.fitness = game_info.right_score
				run = False

	def calculate_fitness(self, genome1, genome2, game_info):
		genome1.fitness += game_info.left_hits
		genome2.fitness += game_info.right_hits

def eval_genomes(genomes, config):
	for i, (genome_id1, genome1) in enumerate(genomes):
		if i == len(genomes) - 1:
			break

		genome1.fitness = 0
		for genome_id2, genome2 in genomes[i + 1:]:
			if genome2.fitness is None:
				genome2.fitness = 0
			game_instance = GameInstance('ai')
			game_instance.train_ai(genome1, genome2, config)

def run_neat(config):
	# pop = neat.Checkpointer.restore_checkpoint('neat-checkpoint-4')
	pop = neat.Population(config)
	pop.add_reporter(neat.StdOutReporter(True))
	stats = neat.StatisticsReporter()
	pop.add_reporter(stats)
	pop.add_reporter(neat.Checkpointer(5))

	winner = pop.run(eval_genomes, 50)

if __name__ == '__main__':
	local_dir = os.path.dirname(__file__)
	config_path = os.path.join(local_dir, 'config.txt')
	config = neat.config.Config(neat.DefaultGenome, neat.DefaultReproduction,
								neat.DefaultSpeciesSet, neat.DefaultStagnation,
								config_path)


	# game_instance = GameInstance('ai')
	# game_instance.test_ai()
