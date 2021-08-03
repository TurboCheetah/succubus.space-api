import { config } from 'dotenv-cra'
import { envParseBoolean, envParseInteger, envParseString } from '@utils/env'

// Unless explicitly defined, set NODE_ENV as development:
process.env.NODE_ENV ??= 'development'

config()

export const app = {
  name: envParseString('APP_NAME'),
  port: envParseInteger('PORT')
}

export const mongo = {
  host: envParseString('MONGO_HOST'),
  port: envParseInteger('MONGO_PORT'),
  database: envParseString('MONGO_DATABASE')
}

export const redis = {
  host: envParseString('REDIS_HOST'),
  port: envParseInteger('REDIS_PORT')
}

export const jwtSecret = envParseString('JWT_SECRET')

export const log = {
  format: envParseString('LOG_FORMAT'),
  dir: envParseString('LOG_DIR')
}

export const monitor = {
  enabled: envParseBoolean('MONITOR_ENABLED'),
  route: envParseString('MONITOR_ROUTE')
}
