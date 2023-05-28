FROM node:alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


FROM node:alpine

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production
RUN mkdir /app/thumbnails
RUN mkdir /app/uploads

COPY --from=builder /app/dist ./dist

CMD [ "node", "dist/main.js"]