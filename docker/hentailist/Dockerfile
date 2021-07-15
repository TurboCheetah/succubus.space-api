FROM node:14

WORKDIR /hentailist
COPY package.json yarn.lock ./
RUN yarn install --prod
COPY ./ ./
EXPOSE 4445
CMD ["node", "index.js"]
