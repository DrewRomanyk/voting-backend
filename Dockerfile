FROM node:carbon

WORKDIR /var/www/app

COPY package*.json ./

RUN npm install
