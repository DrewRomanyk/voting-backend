FROM node:10.4.1

WORKDIR /var/www/app

COPY package*.json ./

RUN npm install
