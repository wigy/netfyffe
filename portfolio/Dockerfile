FROM node:latest

WORKDIR /var/app

ADD package.json .
RUN npm install
ADD . .
RUN npm start

EXPOSE 9002
CMD [ "npm", "start" ]
