export type BooleanString = 'true' | 'false'
export type IntegerString = `${bigint}`

export interface SuccEnv {
  NODE_ENV: 'test' | 'development' | 'production'

  APP_NAME: string
  PORT: IntegerString

  JWT_SECRET: string

  LOG_FORMAT: string
  LOG_DIR: string

  MONITOR_ENABLED: BooleanString
  MONITOR_ROUTE: string

  MONGO_HOST: string
  MONGO_PORT: IntegerString
  MONGO_DATABASE: string

  REDIS_HOST: string
  REDIS_PORT: IntegerString

  SENTRY_ENABLED: BooleanString
  SENTRY_DSN: string
}

export type SuccEnvAny = keyof SuccEnv
export type SuccEnvString = { [K in SuccEnvAny]: SuccEnv[K] extends BooleanString | IntegerString ? never : K }[SuccEnvAny]
export type SuccEnvBoolean = { [K in SuccEnvAny]: SuccEnv[K] extends BooleanString ? K : never }[SuccEnvAny]
export type SuccEnvInteger = { [K in SuccEnvAny]: SuccEnv[K] extends IntegerString ? K : never }[SuccEnvAny]
