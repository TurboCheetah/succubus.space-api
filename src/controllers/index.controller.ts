import { NextFunction, Request, Response } from 'express'
import { autoInjectable } from 'tsyringe'

@autoInjectable()
class IndexController {
  public index = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.send({ message: 'ok' })
    } catch (error) {
      next(error)
    }
  }

  public testInjectable = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.send({ message: 'injectable path' })
    } catch (error) {
      next(error)
    }
  }
}

export default IndexController
