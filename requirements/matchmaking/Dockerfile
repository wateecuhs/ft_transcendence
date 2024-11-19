FROM python:3.11


COPY app/requirements.txt /requirements.txt
RUN pip install -r requirements.txt

COPY app /app

WORKDIR /app

COPY ./conf/run.sh /run.sh

CMD ["/run.sh"]