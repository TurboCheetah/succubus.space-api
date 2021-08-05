import { NextFunction, Request, Response } from 'express'
import hentaiModel from '@/models/hentai.model'
import { client } from '@/databases/redis'

const mongoMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Scrape new data
    const query = req.params.query

    console.log('mongo', query)
    const data = await hentaiModel.findOne({ id: query })

    if (data && !data.invalid) {
      await client.set(query, data)
      return res.send(data)
    } else if (data && data.invalid) {
      await client.set(query, { id: query, invalid: true }, { expire: 86400 })
      return res.sendStatus(404)
    }

    next()
  } catch (err) {
    next(err)
  }
}

export default mongoMiddleware
