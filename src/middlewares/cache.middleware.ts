import { NextFunction, Request, Response } from 'express'
import { ioRedis, client } from '@databases/redis'
import { logger } from '@utils/logger'
import { nhentai } from '@utils/nhentai'
import { sentry } from '@/config'
import { captureException } from '@sentry/node'

const cacheMiddleware = ({ type, random, latest }: { type: 'hentai' | 'doujin'; random?: boolean; latest?: boolean } = { type: 'hentai' }) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (type === 'hentai') {
        // Fetch data from cache
        if (latest) req.params.query = await ioRedis.get('hentai_newestID')
        if (random) req.params.query = (Math.floor(Math.random() * +(await ioRedis.get('hentai_newestID'))) + 1).toString()

        const data = await client.get(`hentai_${req.params.query}`).catch(err => {
          logger.error(err)
          if (process.env.NODE_ENV === 'production' && sentry.enabled) captureException(err)
          next()
        })

        if (data) return res.send(data)
      } else {
        // Fetch data from cache
        if (random) req.params.query = `${await nhentai.randomDoujinID()}`

        const data = await client.get(`doujin_${req.params.query}`).catch(err => {
          logger.error(err)
          if (process.env.NODE_ENV === 'production' && sentry.enabled) captureException(err)
          next()
        })

        if (data) return res.send(data)
      }

      next()
    } catch (err) {
      next(err)
    }
  }
}

export default cacheMiddleware
