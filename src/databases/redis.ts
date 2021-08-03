import { redis } from '@/config'

import Redis from 'ioredis'
import JSONCache from 'redis-json'

export const ioRedis = new Redis(redis.port, redis.host)
export const client = new JSONCache(ioRedis)
