FROM node:10-alpine

WORKDIR /app

COPY package.json package.json

RUN npm i

COPY . .

CMD node app.js