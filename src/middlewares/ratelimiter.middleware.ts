import { NextFunction, Request, Response } from 'express'
import { ioRedis } from '@databases/redis'
import RateLimiter from 'rate-limiter-flexible'

const rateLimiter = new RateLimiter.RateLimiterRedis({
  storeClient: ioRedis,
  points: 1000,
  duration: 60,
  inmemoryBlockOnConsumed: 1000
})

const ratelimitMiddleware = (points: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    rateLimiter
      .consume(req.ip, points)
      .then(limiter => {
        res.set({
          'Retry-After': limiter.msBeforeNext / 1000,
          'X-RateLimit-Limit': points,
          'X-RateLimit-Remaining': limiter.remainingPoints,
          'X-RateLimit-Reset': new Date(Date.now() + limiter.msBeforeNext)
        })
        next()
      })
      .catch(limiter => {
        res.set({
          'Retry-After': limiter.msBeforeNext / 1000,
          'X-RateLimit-Limit': points,
          'X-RateLimit-Remaining': limiter.remainingPoints,
          'X-RateLimit-Reset': new Date(Date.now() + limiter.msBeforeNext)
        })
        return res.status(429).send({
          message: 'Too many requests'
        })
      })
  }
}

export default ratelimitMiddleware
