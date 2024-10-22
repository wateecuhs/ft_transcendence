all : up

up : 
	@docker compose -f requirements/docker-compose.yml up -d

down : 
	@docker compose -f requirements/docker-compose.yml down

stop : 
	@docker compose -f requirements/docker-compose.yml stop

start : 
	@docker compose -f requirements/docker-compose.yml start

status : 
	@docker ps
