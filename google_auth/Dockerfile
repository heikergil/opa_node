FROM node:14

WORKDIR /google-node
COPY ./views ./views
COPY get_opa_decision.js .
COPY server.js .
COPY package.json .
COPY .env .

RUN npm install
EXPOSE 3000

CMD node server.js
