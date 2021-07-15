FROM node:14.9.0-alpine

WORKDIR /hentailist
COPY package.json yarn.lock ./
RUN yarn install --prod
COPY . ./
EXPOSE 4445
CMD ["node", "index.js"]
