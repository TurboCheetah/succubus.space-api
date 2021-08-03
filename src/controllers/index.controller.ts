import { NextFunction, Request, Response } from 'express'

class IndexController {
  public index = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.send({ message: 'ok' })
    } catch (error) {
      next(error)
    }
  }
}

export default IndexController
