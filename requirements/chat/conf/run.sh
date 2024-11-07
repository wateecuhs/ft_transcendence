#!/bin/bash

python3 manage.py makemigrations
python3 manage.py migrate
daphne core.asgi:application -p 80 -b 0.0.0.0