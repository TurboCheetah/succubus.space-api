export type BooleanString = 'true' | 'false'
export type IntegerString = `${bigint}`

export interface SuccEnv {
  NODE_ENV: 'test' | 'development' | 'production'

  APP_NAME: string
  PORT: IntegerString

  LOG_FORMAT: string
  LOG_DIR: string

  MONGO_HOST: string
  MONGO_PORT: IntegerString
  MONGO_DATABASE: string
  MONGO_USER: string
  MONGO_PASSWORD: string

  MYANIMELIST_CLIENT_ID: string
  MYANIMELIST_USERNAME: string
  MYANIMELIST_PASSWORD: string

  REDIS_HOST: string
  REDIS_PORT: IntegerString
  REDIS_PASSWORD: string

  SENTRY_ENABLED: BooleanString
  SENTRY_DSN: string

  READONLY: BooleanString
}

export type SuccEnvAny = keyof SuccEnv
export type SuccEnvString = { [K in SuccEnvAny]: SuccEnv[K] extends BooleanString | IntegerString ? never : K }[SuccEnvAny]
export type SuccEnvBoolean = { [K in SuccEnvAny]: SuccEnv[K] extends BooleanString ? K : never }[SuccEnvAny]
export type SuccEnvInteger = { [K in SuccEnvAny]: SuccEnv[K] extends IntegerString ? K : never }[SuccEnvAny]
