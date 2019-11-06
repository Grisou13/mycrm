ENTRYPOINT ["/bin/start.sh"]
EXPOSE 80
VOLUME /templates
ENV CONSUL_URL consul:8500

ADD nginx.sh /bin/start.sh
ADD nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /etc/nginx/conf.d/*

ADD https://releases.hashicorp.com/consul-template/0.19.5/consul-template_0.19.5_linux_amd64.tgz /usr/bin/consul-template.tgz
RUN tar -C /usr/local/bin -zxf /usr/bin/consul-template.tgz