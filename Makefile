# Configuration
DOCKER_COMPOSE_FILE := requirements/docker-compose.yml
DOCKER_COMPOSE_DEV_FILE := requirements/docker-compose.dev.yml
DOCKER_COMPOSE := docker compose -f $(DOCKER_COMPOSE_FILE)
DOCKER_COMPOSE_DEV := docker compose -f $(DOCKER_COMPOSE_DEV_FILE)

.PHONY: up build dev down stop start clean status ps logs volume_clean

up:
	$(DOCKER_COMPOSE) up -d

build:
	$(DOCKER_COMPOSE) up --build

dev:
	$(DOCKER_COMPOSE_DEV) up -d

down:
	$(DOCKER_COMPOSE) down

stop:
	$(DOCKER_COMPOSE) stop

start:
	$(DOCKER_COMPOSE) start

ps: status
status:
	docker ps

logs:
	$(DOCKER_COMPOSE) logs -f

volume_clean:
	@read -p "Are you sure? [y/N] " confirmation; \
	if [ "$$confirmation" = "y" ] || [ "$$confirmation" = "Y" ]; then \
		docker volume rm $$(docker volume ls -qf dangling=true); \
	fi

clean:
	@read -p "Are you sure? [y/N] " confirmation; \
	if [ "$$confirmation" = "y" ] || [ "$$confirmation" = "Y" ]; then \
		$(DOCKER_COMPOSE) down -v --rmi all; \
		find . -path '*/migrations/*.py' -not -name '__init__.py' -delete; \
		find . -path '*/migrations/*.pyc' -delete; \
		find . -type d -name "__pycache__" -exec rm -rf {} +; \
		find . -name "*.pyc" -delete; \
	fi

.SILENT: help ps status

.DEFAULT_GOAL := help