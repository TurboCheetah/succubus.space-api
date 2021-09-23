import { NextFunction, Request, Response } from 'express'
import { scrapeDoujin, scrapeHentai } from '@utils/util'

const scraperMiddleware = ({ type }: { type: 'hentai' | 'doujin' } = { type: 'hentai' }) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (type === 'hentai') {
        // Scrape new data
        const search = await scrapeHentai(req.params.query)

        return res.send(search)
      } else {
        // Scrape new data
        const search = await scrapeDoujin(req.params.query)

        return res.send(search)
      }
    } catch (err) {
      next(err)
    }
  }
}

export default scraperMiddleware
