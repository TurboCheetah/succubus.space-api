FROM node:16-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install && yarn cache clean

COPY . .

RUN yarn build


FROM node:16-alpine AS production-dependencies

WORKDIR /app

COPY --from=builder ./app/package.json ./app/yarn.lock ./

RUN yarn --prod

FROM gcr.io/distroless/nodejs:14 as runner

WORKDIR /app

COPY --from=production-dependencies ./app/node_modules ./

USER 1000

COPY --from=builder ./app/dist ./dist

EXPOSE 4445

CMD ["yarn", "start:docker"]
