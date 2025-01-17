# Configuration
DOCKER_COMPOSE_FILE := requirements/docker-compose.yml
DOCKER_COMPOSE := docker compose -f $(DOCKER_COMPOSE_FILE)

.PHONY: up build down stop start clean status ps logs volume_clean volumes

all: up

up:
	$(DOCKER_COMPOSE) up -d --build --remove-orphans

down:
	$(DOCKER_COMPOSE) down -v

stop:
	$(DOCKER_COMPOSE) stop

start:
	$(DOCKER_COMPOSE) start

prune:
	docker system prune -af --volumes

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
