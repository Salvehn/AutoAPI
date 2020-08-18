FROM ubuntu:latest
LABEL maintainer="Salvehn"
COPY . /app

ENV TZ=Europe/Moscow
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN echo "Setting up gateway..."
RUN apt-get update && apt-get install systemd -y && apt-get install net-tools
RUN apt-get install nodejs -y && apt-get install npm -y
RUN echo "Setup complete!"
WORKDIR ./app
RUN npm i express

EXPOSE 3000 3001
