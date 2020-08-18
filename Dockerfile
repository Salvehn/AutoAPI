FROM ubuntu:latest
LABEL maintainer="Salvehn"
COPY . ./app
RUN echo "Installing keepalived..."
ENV TZ=Europe/Moscow
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN apt-get update && apt-get install keepalived -y
RUN echo "keepalived installed!"
RUN apt-get install systemd -y
RUN service keepalived enable

RUN echo $"\nvrrp_instance_proxy_ip1 {\n\
    state MASTER\n\
    interface eth0\n\
    virtual_router_id 1\n\
    priority 255\n\
    virtual_ipadress {\n\
      192.168.2.101/24 dev eth0 label eth0:1\n\
    }\n\
  }\n\
  vrrp_instance_proxy_ip2 {\n\
    state BACKUP\n\
    interface eth0\n\
    virtual_router_id 2\n\
    priority 100\n\
    virtual_ipadress{\n\
      192.168.2.102/24 dev eth0 label eth0:2\n\
    }\n\
  }\n\
" >> /etc/keepalived/keepalived.conf
RUN service keepalived restart
RUN apt-get install iptables -y
RUN apt-get install nodejs -y && apt-get install npm -y
