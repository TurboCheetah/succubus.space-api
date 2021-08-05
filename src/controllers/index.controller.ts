import { NextFunction, Request, Response } from 'express'
import { app } from '@/config'

class IndexController {
  public index = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.send({ message: 'ok', version: app.version })
    } catch (error) {
      next(error)
    }
  }
}

export default IndexController
