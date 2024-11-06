# Use the official PostgreSQL image from the Docker Hub
FROM postgres:17-alpine3.20

EXPOSE 5432
COPY conf/init.sh /docker-entrypoint-initdb.d/
