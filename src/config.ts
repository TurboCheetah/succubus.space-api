import { config } from 'dotenv-cra'
import * as pkg from '../package.json'
import { envParseBoolean, envParseInteger, envParseString } from '@utils/env'

// Unless explicitly defined, set NODE_ENV as development:
process.env.NODE_ENV ??= 'development'

config()

export const app = {
  name: envParseString('APP_NAME'),
  version: pkg.version,
  port: envParseInteger('PORT')
}

export const jwtSecret = envParseString('JWT_SECRET')

export const log = {
  format: envParseString('LOG_FORMAT'),
  dir: envParseString('LOG_DIR')
}

export const mongo = {
  host: envParseString('MONGO_HOST'),
  port: envParseInteger('MONGO_PORT'),
  database: envParseString('MONGO_DATABASE')
}

export const monitor = {
  enabled: envParseBoolean('MONITOR_ENABLED'),
  route: envParseString('MONITOR_ROUTE')
}

export const redis = {
  host: envParseString('REDIS_HOST'),
  port: envParseInteger('REDIS_PORT')
}

export const sentry = {
  enabled: envParseBoolean('SENTRY_ENABLED'),
  dsn: envParseString('SENTRY_DSN')
}
