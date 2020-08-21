#!/bin/bash
read -p "Enter gateway count: " gateways
echo "Gateways amount set to: $gateways"
read -p "Enter database entities: " dbs
echo "DB list: $dbs"
subnet='10.5.50'
balancer_options='upstream backend {\n\
'
for gw in $(seq 1 $gateways);
do
  balancer_options+="      server $subnet.$((gw+1)):300$gw;\\n\\"$'\n';
done

balancer_conf='\n\
   '$balancer_options'\n\
  }\n\
   server {\n\
      listen 80;\n\
      location / {\n\
          proxy_pass http://backend;\n\
      }\n\
   }'
balancer_run='
FROM nginx:latest
LABEL maintainer="Salvehn"
RUN rm /etc/nginx/conf.d/default.conf
COPY . /app
RUN echo "Creating balancer.."
ENV TZ=Europe/Moscow
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN apt-get update && apt-get install net-tools && apt-get install nginx -y
RUN echo "keepalived installed!"
RUN apt-get install systemd -y
RUN touch /etc/nginx/conf.d/load-balancer.conf
RUN echo '"'"''$balancer_conf''"'"' > /etc/nginx/conf.d/load-balancer.conf

EXPOSE 80
'

echo "$balancer_run" > ./balancer/Dockerfile
echo '
version: '\'3.8\''

services:
  balancer:
    container_name: balancer
    build:
      context: ./balancer
      dockerfile: Dockerfile
    hostname: balancer
    networks:
      micro:
        ipv4_address: 10.5.50.60
    privileged: true
    ports:
      - "80:80"

    restart: unless-stopped
    tty: true
    command: ln -s /etc/nginx/sites-available/vhost /etc/nginx/sites-enabled/vhost
    command: /usr/sbin/nginx -g "daemon off;"
  sessions:
    container_name: sessions_storage
    image: mongo:latest
    environment:
      MONGO_INITDB_DATABASE: express_sessions
      MONGO_INITDB_ROOT_USERNAME: sessions
      MONGO_INITDB_ROOT_PASSWORD: micro_sessions
    ports:
      - 27017:27017
    volumes:
      - mongodb_data_container:/data/db
    networks:
      micro:
        ipv4_address: 10.5.50.70
    restart: unless-stopped
    tty: true
' > docker-compose.yml
for gw in $(seq 1 $gateways);
do
  echo '
  gateway_'$gw':
    container_name: gateway_'$gw'
    build:
      context: ./gateway
    networks:
      micro:
        ipv4_address: '$subnet'.'$((gw+1))'
    working_dir: /app
    ports:
      - "300'$gw':300'$gw'"
    command: node server.js 300'$gw' "'$dbs'"
    expose:
      - "300'$gw'"
      - "8000-8100"
  ' >> docker-compose.yml
done

IFS=' ' read -ra ADDR <<< "$dbs"
for db in "${ADDR[@]}";
do
  echo '
  db_client_'$db':
    container_name: db_client_'$db'
    build:
      context: ./database
    networks:
      micro:
        ipv4_address: '$subnet'.'$((gw+80))'
    working_dir: /app
    command: node database.js '$db' '$subnet'.'$((gw+150))'

    expose:
      - "8000-8100"
  db_'$db':
    container_name: db_'$db'
    image: mongo:latest
    networks:
      micro:
        ipv4_address: '$subnet'.'$((gw+150))'
    working_dir: /app

    expose:
      - "8000-8100"
  ' >> docker-compose.yml
done

echo '
volumes:
  mongodb_data_container:


networks:
#Internal-only network for proper nginx proxying and ssh
  micro:
    driver: bridge
    ipam:
     driver: default
     config:
       - subnet: '$subnet'.0/16

#External network actually
  default:
    driver: bridge
' >> docker-compose.yml
read -p "Press enter to build containers"
eval 'docker-compose build'
read -p "Press enter to start containers"
eval 'docker-compose up -d'
