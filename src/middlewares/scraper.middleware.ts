import { NextFunction, Request, Response } from 'express'
import { scrapeData } from '@utils/util'

const scraperMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Scrape new data
    const search = await scrapeData(req.params.query)

    res.send(search)

    next()
  } catch (err) {
    next(err)
  }
}

export default scraperMiddleware
