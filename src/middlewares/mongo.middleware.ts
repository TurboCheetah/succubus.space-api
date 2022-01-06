import { NextFunction, Request, Response } from 'express'
import hentaiModel from '@/models/hentai.model'
import doujinModel from '@/models/doujin.model'
import { client } from '@/databases/redis'

const mongoMiddleware = ({ type }: { type: 'hentai' | 'doujin' } = { type: 'hentai' }) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.params.query

      if (type === 'hentai') {
        const data = isNaN(+query)
          ? await hentaiModel.findOne({ name: { $regex: new RegExp(query.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&'), 'i') } })
          : await hentaiModel.findOne({ id: query })

        if (data) {
          await client.set(`hentai_${query}`, data.toJSON(), { expire: 3600 })
          return res.send(data)
        }
      } else {
        const data = isNaN(+query)
          ? await doujinModel.findOne({ 'titles.pretty': { $regex: new RegExp(query.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&'), 'i') } })
          : await doujinModel.findOne({ id: query })

        if (data) {
          await client.set(`doujin_${query}`, data.toJSON(), { expire: 3600 })
          return res.send(data)
        }
      }

      next()
    } catch (err) {
      next(err)
    }
  }
}

export default mongoMiddleware
