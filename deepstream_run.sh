docker run -d --rm -p 6020:6020 -p 8080:8080 deepstreamio/deepstream.io:latest
docker run -d --rm -p 27017:27017 --name MONGODB mongo
docker wait MONGODB
docker run -d --rm \
    --link MONGODB
    -p 8081:8081 \
    mongo-express