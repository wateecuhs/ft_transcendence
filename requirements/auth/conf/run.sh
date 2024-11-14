#!/bin/bash

python3 manage.py makemigrations
python3 manage.py migrate
daphne transcendence.asgi:application -p 80 -b 0.0.0.0