docker run -d --rm -p 6020:6020 -p 8080:8080 deepstreamio/deepstream.io:latest
docker run -d --rm -p 27017:27017 --name MONGODB mongo
until [ "`/usr/bin/docker inspect -f {{.State.Health.Status}} CONTAINERNAME`"=="MONGODB" ]; do
    sleep 0.1;
done;
docker run -d --rm --link MONGODB:mongo -p 8081:8081 mongo-express