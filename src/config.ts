import { config } from 'dotenv-cra'
import { envParseBoolean, envParseInteger, envParseString } from '@utils/env'

// Unless explicitly defined, set NODE_ENV as development:
process.env.NODE_ENV ??= 'development'

config()

export const app = {
  name: envParseString('APP_NAME'),
  port: envParseInteger('PORT')
}

export const log = {
  format: envParseString('LOG_FORMAT'),
  dir: envParseString('LOG_DIR')
}

export const mongo = {
  host: envParseString('MONGO_HOST'),
  port: envParseInteger('MONGO_PORT'),
  database: envParseString('MONGO_DATABASE'),
  user: envParseString('MONGO_USER'),
  password: envParseString('MONGO_PASSWORD')
}

export const myanimelist = {
  clientID: envParseString('MYANIMELIST_CLIENT_ID'),
  username: envParseString('MYANIMELIST_USERNAME'),
  password: envParseString('MYANIMELIST_PASSWORD')
}

export const redis = {
  host: envParseString('REDIS_HOST'),
  port: envParseInteger('REDIS_PORT'),
  password: envParseString('REDIS_PASSWORD')
}

export const sentry = {
  enabled: envParseBoolean('SENTRY_ENABLED'),
  dsn: envParseString('SENTRY_DSN')
}
