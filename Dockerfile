FROM node:16-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install && yarn cache clean

COPY . .

RUN yarn build

FROM node:16-alpine

WORKDIR /app

COPY --from=builder ./app/package.json ./app/yarn.lock ./

RUN yarn --prod && yarn cache clean

EXPOSE 4445

ENV NODE_ENV production

COPY --from=builder ./app/dist ./dist

CMD ["yarn", "start:docker"]
