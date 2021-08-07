import { NextFunction, Request, Response } from 'express'
import hentaiModel from '@/models/hentai.model'
import { client } from '@/databases/redis'
import { dataBuilder } from '@/utils/util'

const mongoMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.params.query

    const data = isNaN(+query) ? await hentaiModel.findOne({ name: { $regex: query } }) : await hentaiModel.findOne({ id: query })

    if (data && !data.invalid) {
      await client.set(query, dataBuilder(data))
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
