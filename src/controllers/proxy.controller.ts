import { NextFunction, Request, Response } from 'express'
import p from 'phin'
import { autoInjectable } from 'tsyringe'

@autoInjectable()
class ProxyController {
  public proxy = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const url = decodeURIComponent(req.params.query)

      // check if url is valid nHentai url
      if (!url.match(/https:\/\/i\.nhentai\.net\/galleries\/\d+\/\d+\.jpg/)) {
        return res.status(400).json({
          error: 'Invalid URL'
        })
      }

      const data = await p({ url, stream: true })

      return data.pipe(res)
    } catch (error) {
      next(error)
    }
  }
}

export default ProxyController
