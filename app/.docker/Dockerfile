FROM node:20
USER node

WORKDIR /app

COPY --chown=node:node .env /app/.env
COPY --chown=node:node ./app /app

RUN npm install && npm run build
CMD ["npm", "run", "start"]