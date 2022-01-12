import type { SuccEnv } from '#interfaces/succenv.interface'

declare global {
  namespace NodeJS {
    type ProcessEnv = SuccEnv
  }
}
