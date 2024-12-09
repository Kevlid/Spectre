FROM node:20

WORKDIR /app

ENV NODE_ENV production

COPY . .

RUN npm install && npm run build
CMD ["npm", "run", "start"]