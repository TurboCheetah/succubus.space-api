FROM node:16-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN sed -i 's/"prepare": "husky install"/"prepare": ""/' ./package.json

RUN npm i -g pnpm
RUN pnpm i --prod --frozen-lockfile

ENV GROUP=nodejs
ENV USER=succubus
ENV UID=1001
ENV GID=1001

RUN addgroup \
    --system \
    --gid "${GID}" \
    "${GROUP}"
RUN adduser \
    --system \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    "${USER}"

COPY . .
RUN pnpm build

FROM gcr.io/distroless/nodejs:18 as runner

WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /etc/passwd /etc/passwd
COPY --from=builder /etc/group /etc/group
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist dist

USER succubus

EXPOSE 4445
ENV PORT 4445
CMD ["dist/server.js"]
