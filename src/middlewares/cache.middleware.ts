import { NextFunction, Request, Response } from 'express'
import { ioRedis, client } from '@databases/redis'
import { logger } from '@utils/logger'
import { nhentai } from '@utils/nhentai'

const cacheMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isHentai = req.path.startsWith('/hentai')
    if (isHentai) {
      // Fetch data from cache
      if (req.path === '/hentai/random') req.params.query = (Math.floor(Math.random() * +(await ioRedis.get('hentai_newestID'))) + 1).toString()

      const data = await client.get(`hentai_${req.params.query}`).catch(err => {
        logger.error(err)
        next()
      })

      if (data) return res.send(data)
    } else {
      // Fetch data from cache
      if (req.path === '/doujin/random') req.params.query = `${await nhentai.randomDoujinID()}`

      const data = await client.get(`doujin_${req.params.query}`).catch(err => {
        logger.error(err)
        next()
      })

      if (data) return res.send(data)
    }

    next()
  } catch (err) {
    next(err)
  }
}

export default cacheMiddleware
