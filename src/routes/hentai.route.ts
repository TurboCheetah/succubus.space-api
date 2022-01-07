import { Router } from 'express'
import { Routes } from '@interfaces/routes.interface'
import HentaiController from '@controllers/hentai.controller'
import ratelimitMiddleware from '@middlewares/ratelimiter.middleware'
import cacheMiddleware from '@middlewares/cache.middleware'
import mongoMiddleware from '@middlewares/mongo.middleware'
import scraperMiddleware from '@middlewares/scraper.middleware'
import { autoInjectable } from 'tsyringe'

@autoInjectable()
class HentaiRoute implements Routes {
  public path = '/hentai'
  public router = Router()

  constructor(private controller: HentaiController) {
    this.initializeRoutes()
    this.controller = controller
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/hanime/:query`, ratelimitMiddleware(300), this.controller.hanime)
    this.router.get(`${this.path}/brand/:query`, ratelimitMiddleware(1), this.controller.brand)
    this.router.get(`${this.path}/tag/:query`, ratelimitMiddleware(1), this.controller.tag)
    this.router.get(`${this.path}/rank/:query`, ratelimitMiddleware(1), this.controller.monthlyRank)
    this.router.get(`${this.path}/scrape/:query`, ratelimitMiddleware(300), scraperMiddleware({ type: 'hentai' }))
    this.router.get(
      `${this.path}/latest`,
      ratelimitMiddleware(1),
      cacheMiddleware({ type: 'hentai', latest: true }),
      mongoMiddleware({ type: 'hentai' }),
      scraperMiddleware({ type: 'hentai' })
    )
    this.router.get(
      `${this.path}/random`,
      ratelimitMiddleware(1),
      cacheMiddleware({ type: 'hentai', random: true }),
      mongoMiddleware({ type: 'hentai' }),
      scraperMiddleware({ type: 'hentai' })
    )
    this.router.get(
      `${this.path}/:query`,
      ratelimitMiddleware(1),
      cacheMiddleware({ type: 'hentai' }),
      mongoMiddleware({ type: 'hentai' }),
      scraperMiddleware({ type: 'hentai' })
    )
  }
}

export default HentaiRoute
