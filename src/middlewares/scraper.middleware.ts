import { NextFunction, Request, Response } from 'express'
import { Utils } from '@utils/Utils'
import { container } from 'tsyringe'

const scraperMiddleware = ({ type }: { type: 'hentai' | 'doujin' } = { type: 'hentai' }) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (type === 'hentai') {
        // Scrape new data
        const search = await container.resolve(Utils).scrapeHentai(req.params.query)

        return res.send(search)
      } else {
        // Scrape new data
        const search = await await container.resolve(Utils).scrapeDoujin(req.params.query)

        return res.send(search)
      }
    } catch (err) {
      next(err)
    }
  }
}

export default scraperMiddleware
