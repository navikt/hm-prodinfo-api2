FROM navikt/node-express:12.2.0-alpine

ENV HOME=/home/node/app

RUN mkdir -p $HOME && chown -R node:node $HOME

WORKDIR $HOME
USER node

COPY --chown=node:node package*.json $HOME/

RUN npm i && npm cache clean --force    

COPY --chown=node:node . .

EXPOSE 1433
EXPOSE 1434
EXPOSE 5000

CMD [ "node", "./bin/www" ]