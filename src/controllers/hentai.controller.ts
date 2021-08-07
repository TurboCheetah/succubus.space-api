import { hanime } from '@utils/hanime'
import { NextFunction, Request, Response } from 'express'

class HentaiController {
  public hanime = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const search = await hanime(req.params.query)

      if (search.invalid) return res.send(search)
    } catch (error) {
      next(error)
    }
  }
}

export default HentaiController
