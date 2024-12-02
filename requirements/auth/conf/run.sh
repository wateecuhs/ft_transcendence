#!/bin/bash

python3 manage.py makemigrations
python3 manage.py migrate
daphne transcendence.asgi:application -p 8001 -b 0.0.0.0