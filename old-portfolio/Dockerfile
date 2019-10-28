FROM node:latest

WORKDIR /var/app

ADD package.json .
RUN npm install
ADD . .
RUN npm run doc
RUN npm run load

EXPOSE 9002
CMD [ "npm", "start" ]
