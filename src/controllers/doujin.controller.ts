import doujinModel from '@models/doujin.model'
import { NextFunction, Request, Response } from 'express'

class DoujinController {
  public tag = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = req.query.order || 'desc'

      const data = await doujinModel.find({ tags: { $regex: req.params.query } }).sort({ length: order })

      return res.send(data)
    } catch (error) {
      next(error)
    }
  }

  public popular = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = req.query.order || 'desc'

      const data = await doujinModel.find().sort({ favorites: order })

      return res.send(data)
    } catch (error) {
      next(error)
    }
  }

  public length = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = req.query.order || 'desc'

      const data = await doujinModel.find().sort({ length: order })

      return res.send(data)
    } catch (error) {
      next(error)
    }
  }

  public age = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = req.query.order || 'asc'

      const data = await doujinModel.find().sort({ uploadDate: order })

      return res.send(data)
    } catch (error) {
      next(error)
    }
  }
}

export default DoujinController
