import { redis } from '#/config'

import Redis from 'ioredis'
import JSONCache from 'redis-json'

export const ioRedis = new Redis({
  host: redis.host,
  port: redis.port,
  password: redis.password
})
export const client = new JSONCache(ioRedis)
