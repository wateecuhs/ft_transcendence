FROM python:3.11

COPY app /app

WORKDIR /app

RUN pip install -r requirements.txt

CMD ["daphne", "live_chat.asgi:application", "-p", "80", "-b", "0.0.0.0"]