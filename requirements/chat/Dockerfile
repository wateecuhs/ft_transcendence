FROM python:3.11


COPY app/requirements.txt /requirements.txt
RUN pip install -r requirements.txt

COPY app /app

WORKDIR /app

CMD ["daphne", "core.asgi:application", "-p", "80", "-b", "0.0.0.0"]