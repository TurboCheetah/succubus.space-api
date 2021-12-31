import hentaiModel from '@/models/hentai.model'
import { hanime } from '@utils/hanime'
import { NextFunction, Request, Response } from 'express'
import { autoInjectable } from 'tsyringe'

@autoInjectable()
class HentaiController {
  public hanime = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const search = await hanime(req.params.query)

      return res.send(search)
    } catch (error) {
      next(error)
    }
  }

  public brand = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await hentaiModel.find({ brand: { $regex: new RegExp(req.params.query.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&'), 'i') } })

      return res.send(data)
    } catch (error) {
      next(error)
    }
  }

  public tag = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await hentaiModel.find({ tags: { $regex: new RegExp(req.params.query.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&'), 'i') } })

      return res.send(data)
    } catch (error) {
      next(error)
    }
  }

  public monthlyRank = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await hentaiModel.findOne({ monthlyRank: +req.params.query })

      return res.send(data)
    } catch (error) {
      next(error)
    }
  }
}

export default HentaiController
