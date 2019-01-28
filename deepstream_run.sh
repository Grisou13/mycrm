docker run -p 6020:6020 8080:8080 deepstreamio/deepstream.io:latest
docker run -p 27017:27017 --name MONGODB -d mongo
docker run -it --rm \
    --name MONGOEXPRESS \
    --link MONGODB:mongo \
    -p 8081:8081 \
    mongo-express