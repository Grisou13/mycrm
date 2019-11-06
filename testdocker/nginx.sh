#!/bin/bash
service nginx start
consul-template -consul-addr=$CONSUL_URL \
-template="/templates/app.ctmpl:/etc/nginx/conf.d/app.conf:service nginx reload"