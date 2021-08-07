import { NextFunction, Request, Response } from 'express'
import { ioRedis, client } from '@databases/redis'
import { logger } from '@utils/logger'

const cacheMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Fetch data from cache
    if (req.path === '/random') req.params.query = (Math.floor(Math.random() * +(await ioRedis.get('newestID'))) + 1).toString()

    const data = await client.get(req.params.query).catch(err => {
      logger.error(err)
      next()
    })

    if (data) return res.send(data)

    next()
  } catch (err) {
    next(err)
  }
}

export default cacheMiddleware
