all : up

up : 
	@docker compose -f requirements/docker-compose.yml up -d

build:
	@docker compose -f requirements/docker-compose.yml up --build

down : 
	@docker compose -f requirements/docker-compose.yml down

stop : 
	@docker compose -f requirements/docker-compose.yml stop

start : 
	@docker compose -f requirements/docker-compose.yml start

clean : | stop
	@docker compose -f requirements/docker-compose.yml down --volumes --rmi all

status : 
	@docker ps
