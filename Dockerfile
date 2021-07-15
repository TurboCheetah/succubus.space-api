FROM node:14.9.0-alpine

WORKDIR /succubus.space

COPY package.json yarn.lock ./

RUN yarn install --prod && yarn cache clean

COPY . .

EXPOSE 4445
CMD ["node", "src/index.js"]
