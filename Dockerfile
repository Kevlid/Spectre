# syntax=docker/dockerfile:1
FROM node:20-alpine

WORKDIR /app

# Install deps first (better cache)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Migrations
RUN npm run migrate:run

# Run the compiled JS
CMD ["npm", "run", "start"]
