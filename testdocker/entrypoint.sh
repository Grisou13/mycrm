#basic script for testing
IP=$(docker inspect --format '{{ .NetworkSettings.IPAddress }}')
consul -retry-join $CONSUL_HOST \
   -advertise $SELF_IP \
   -data-dir /tmp/consul \
   -config-file '{
   "id": "$SERVICE_NAME-$hostname", 
   "name": "$SERVICE_NAME", 
   "check": {
      "script": /etc/consul.d/check_scripts/check_{$SERVICE_TYPE}.sh, 
      "interval": "15s"
   }
}'
# http://$CONSUL_URL:8500/v1/agent/service/register
# http service
consul -retry-join $CONSUL_HOST \
   -advertise $SELF_IP \
   -data-dir /tmp/consul \
   -config-file '{
   "id": "$SERVICE_NAME-$hostname", 
   "name": "$SERVICE_NAME", 
   "checks": [{
      "id": "check_http",
      "name": "/health",
      "http": "http://localhost:5000/health",
      "interval": "15s",
   },
   {
      "id": "check_pid_running",
      "script": /etc/consul.d/check_scripts/check_{$SERVICE_TYPE}.sh, 
      "interval": "15s"
   }]
}' http://$CONSUL_URL:8500/v1/agent/service/register
#register port
curl -X PUT -d $PORT http://localhost:8500/v1/kv/$SERVICE_NAME

