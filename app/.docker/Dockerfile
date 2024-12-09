FROM node:20
USER node

COPY --chown=node:node .env /spectre/app/.env
COPY --chown=node:node ./app /spectre/app

WORKDIR /spectre/app

RUN npm install && npm run build
CMD ["npm", "run", "start"]
