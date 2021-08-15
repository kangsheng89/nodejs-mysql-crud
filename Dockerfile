FROM node:12.18.2-alpine3.9
# Create app directory
WORKDIR /usr/src/app
EXPOSE 4000

RUN apk add --no-cache bash make git py3-pip openssh-client curl

COPY . nodejs-mysql-crud

RUN cd ./nodejs-mysql-crud && \
    rm -rf .git && \
    npm install && \
    npm cache clean --force && \
    touch .env

CMD cd nodejs-mysql-crud && node app.js


