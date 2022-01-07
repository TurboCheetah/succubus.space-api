import { NextFunction, Request, Response } from 'express'
import p from 'phin'
import { autoInjectable } from 'tsyringe'

@autoInjectable()
class ProxyController {
  public proxy = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const url = `${req.query.url}`

      // check if url is valid nHentai url
      // check if the url has the nHentai domain and any subdomains on it
      if (!url || !url.match(/^https:\/\/(?:.+)\.?nhentai\.net\/galleries\/\d+\/.+\..+/)) {
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
