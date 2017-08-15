FROM node:latest

WORKDIR /var/app

ADD package.json .
RUN npm install
ADD . .

EXPOSE 9000
CMD ["npm", "start"]
