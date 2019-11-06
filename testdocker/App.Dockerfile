FROM node:latest
RUN apt-get update -qq
RUN mkdir /app
WORKDIR /app
COPY package.lock /app/package.lock
COPY package.json /app/package.json
RUN npm install
COPY . /app
ENV SERVICE_NAME "test-app"
ENV PORT "3000"

# Add a script to be executed every time the container starts.
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]
EXPOSE 3000

# Start the main process.
CMD ["npm run start"]