FROM node:14

WORKDIR /hentailist
COPY ./package.json ./
RUN yarn install
COPY ./ ./
EXPOSE 4445
CMD ["node", "index.js"]
