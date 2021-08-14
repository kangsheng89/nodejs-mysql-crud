FROM node:12.18.2-alpine3.9
# Create app directory
WORKDIR /usr/src/app
EXPOSE 4000
EXPOSE 3306

RUN apk add --no-cache bash make git py3-pip openssh-client curl

# RUN git clone https://github.com/kangsheng89/nodejs-mysql-crud
COPY . nodejs-mysql-crud

RUN cd ./nodejs-mysql-crud && \
    rm -rf .git && \
    npm install && \
    npm cache clean --force && \
    touch .env

CMD cd nodejs-mysql-crud && node app.js


