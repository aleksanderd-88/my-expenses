FROM node:alpine

WORKDIR /usr/src/app/client

COPY package*.json ./

RUN yarn config set ignore-engines true

RUN yarn install

EXPOSE 5173

CMD ["yarn", "dev"]