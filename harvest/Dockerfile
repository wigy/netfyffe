FROM node:latest

WORKDIR /var/app

ADD package.json .
RUN npm install
ADD . .
RUN npm run doc

EXPOSE 9001
CMD ["npm", "start"]
