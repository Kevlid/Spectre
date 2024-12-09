FROM node:20
USER node

WORKDIR /app

RUN npm install && npm run build
CMD ["npm", "run", "start"]