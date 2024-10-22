FROM python:3.11

COPY app /app

WORKDIR /app

ENV CLIENT_ID='u-s4t2ud-8f558fa017dd0199841b4f9f6f35bb6dbe31e92375f37af4993b088964ae26f1'
ENV CLIENT_SECRET='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=value'

RUN pip install -r requirements.txt

CMD ["daphne", "live_chat.asgi:application", "--port", "3336"]