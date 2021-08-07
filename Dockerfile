FROM node:16-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install && yarn cache clean

COPY . .

EXPOSE 4445

ENV NODE_ENV production

RUN yarn build

CMD ["yarn", "start:docker"]
