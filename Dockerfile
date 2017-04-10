FROM node

COPY index.js /data/index.js
COPY package.json /data/package.json

WORKDIR /data
RUN npm install

VOLUME /data/acme-challenge
VOLUME /data/certs

EXPOSE 8080
EXPOSE 8443

CMD npm start