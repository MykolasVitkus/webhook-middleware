FROM node:15.8

WORKDIR /usr/src/server

COPY ./webhook-middleware-server .

RUN yarn install

RUN yarn build

ENV SERVER_URL=http://localhost:3001/

WORKDIR /usr/src/app

COPY ./webhook-middleware-client .

RUN yarn install

RUN yarn build

COPY ./scripts/entrypoint.sh /usr/bin/start.sh

ENTRYPOINT [ "/usr/bin/start.sh" ]