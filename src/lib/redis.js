import Redis from 'ioredis'
import JSONCache from 'redis-json'

export const ioRedis = new Redis({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT })
export const client = new JSONCache(ioRedis)
