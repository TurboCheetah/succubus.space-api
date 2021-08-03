import { NextFunction, Request, Response } from 'express'
import { cacheData } from '@utils/util'

const scraperMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Scrape new data
    const search = await cacheData(req.params.query)

    if (search.invalid) return res.sendStatus(404)

    res.send(search)

    next()
  } catch (err) {
    next(err)
  }
}

export default scraperMiddleware
