FROM node:latest

WORKDIR /var/app

ADD package.json .
RUN npm install
ADD . .
RUN npm start

EXPOSE 9000
CMD [ "npm", "start" ]
