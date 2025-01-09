FROM node:20
USER node

COPY --chown=node:node . /spectre
COPY --chown=node:node .env /spectre/app/.env
WORKDIR /spectre/app

RUN npm ci && npm run build