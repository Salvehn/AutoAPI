FROM node:latest
LABEL maintainer="Salvehn"
COPY . /app

ENV TZ=Europe/Moscow
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN echo "Setting up gateway..."
RUN apt-get update && apt-get install systemd -y && apt-get install net-tools && apt-get install lynx -y && apt-get install wget -y

RUN echo "Setup complete!"
WORKDIR ./app
RUN npm i express
RUN npm i socket.io
RUN npm i express-session
RUN npm i connect-mongodb-session
RUN npm i express-socket.io-session
RUN npm i cote
RUN npm i cors
