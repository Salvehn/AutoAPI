
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
RUN echo '\n\
   upstream backend {\n\
      server 10.5.50.2:3001;\n\
\n\
  }\n\
   server {\n\
      listen 80;\n\
      location / {\n\
          proxy_pass http://backend;\n\
      }\n\
   }' > /etc/nginx/conf.d/load-balancer.conf

EXPOSE 80

