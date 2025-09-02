# syntax=docker/dockerfile:1
FROM node:20

# Install deps first (better cache)
COPY --chown=node:node . /
COPY --chown=node:node .env /app/.env
WORKDIR /app

# Install and build
RUN npm ci && npm run build

# Migrations
RUN npm run migrate:run

# Run the compiled JS
CMD ["npm", "run", "start"]
