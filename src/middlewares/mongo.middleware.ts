import { NextFunction, Request, Response } from 'express'
import hentaiModel from '@/models/hentai.model'
import doujinModel from '@/models/doujin.model'
import { client } from '@/databases/redis'
import { doujinBuilder, hentaiBuilder } from '@utils/util'

const mongoMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isHentai = req.path.startsWith('/hentai')
    const query = req.params.query

    if (isHentai) {
      const data = isNaN(+query) ? await hentaiModel.findOne({ name: { $regex: new RegExp(query, 'i') } }) : await hentaiModel.findOne({ id: query })

      if (data && !data.invalid) {
        await client.set(`hentai_${query}`, hentaiBuilder(data), { expire: 3600 })
        return res.send(data)
      } else if (data && data.invalid) {
        await client.set(`hentai_${query}`, { id: query, invalid: true }, { expire: 86400 })
        return res.send(data)
      }
    } else {
      // TODO search by titles in  Mongo
      const data = isNaN(+query)
        ? await doujinModel.findOne({ 'titles.pretty': { $regex: new RegExp(query, 'i') } })
        : await doujinModel.findOne({ id: query })

      if (data && !data.invalid) {
        await client.set(`doujin_${query}`, doujinBuilder(data), { expire: 3600 })
        return res.send(data)
      } else if (data && data.invalid) {
        await client.set(`doujin_${query}`, { id: query, invalid: true }, { expire: 86400 })
        return res.send(data)
      }
    }

    next()
  } catch (err) {
    next(err)
  }
}

export default mongoMiddleware
