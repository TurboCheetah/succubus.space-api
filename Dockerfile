# Common build stage
FROM node:16-alpine as common-build-stage

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install && yarn cache clean

COPY . .

EXPOSE 4445

# Development build stage
FROM common-build-stage as development-build-stage

ENV NODE_ENV development

CMD ["yarn", "dev"]

# Production build stage
FROM common-build-stage as production-build-stage

ENV NODE_ENV production

CMD ["yarn", "start"]
