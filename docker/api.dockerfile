FROM node:14-alpine
MAINTAINER ITALO BARBOZA E MARCOS BORGES
COPY . /var/www
WORKDIR /var/www
ENTRYPOINT node index.js
EXPOSE 80
