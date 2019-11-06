FROM mysql:latest
RUN apt-get update -qq

ENV CONSUL_URL "consul"
ENV SERVICE_NAME "test-app-db"
ENV PORT "3306"

# Add a script to be executed every time the container starts.
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]
EXPOSE 3306
