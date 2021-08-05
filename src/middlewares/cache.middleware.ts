import { NextFunction, Request, Response } from 'express'
import { ioRedis, client } from '@databases/redis'
import { logger } from '@utils/logger'

const cacheMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('cache', req.params.query)

    // Fetch data from cache
    if (req.path === '/random') req.params.query = (Math.floor(Math.random() * +(await ioRedis.get('newestID'))) + 1).toString()

    const data = await client.get(req.params.query).catch(err => {
      logger.error(err)
      next()
    })

    if (data && !data.invalid) {
      return res.send(data)
    } else if (data && data.invalid) {
      return res.sendStatus(404)
    }

    next()
  } catch (err) {
    next(err)
  }
}

export default cacheMiddleware
