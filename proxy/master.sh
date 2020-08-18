#!/bin/bash
touch /etc/keepalived/keepalived.conf
touch /etc/haproxy/haproxy.cfg
echo $'vrrp_script chk_haproxy {
script "killall -0 haproxy" # check the haproxy process
  interval 2 # every 2 seconds
  weight 2 # add 2 points if OK
}

vrrp_instance VI_1 {
  interface eth1 # interface to monitor
  state MASTER
  virtual_router_id 1
  priority 101
  virtual_ipaddress {
    10.0.26.81
  }
  track_script {
    chk_haproxy
  }
  authentication {
    auth_type PASS
    auth_pass Xkg2GfAcafb4HA3
  }
}
vrrp_instance VI_2 {
  interface eth1 # interface to monitor
  state MASTER
  virtual_router_id 2
  priority 101
  virtual_ipaddress {
    10.0.26.91
  }
  track_script {
    chk_haproxy
  }
  authentication {
    auth_type PASS
    auth_pass Xkg2GfAcafb4HA3
  }
}
' > /etc/keepalived/keepalived.conf

echo $"
frontend http_web *:80
    mode http
    default_backend gateway

backend gateway
    balance roundrobin
    mode http
    server  gateway1 10.5.0.5:3000 check
    server  gateway2 10.5.0.6:3001 check
" > /etc/haproxy/haproxy.cfg
