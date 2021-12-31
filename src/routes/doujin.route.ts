import { Router } from 'express'
import { Routes } from '@interfaces/routes.interface'
import DoujinController from '@controllers/doujin.controller'
import ratelimitMiddleware from '@middlewares/ratelimiter.middleware'
import cacheMiddleware from '@middlewares/cache.middleware'
import mongoMiddleware from '@middlewares/mongo.middleware'
import scraperMiddleware from '@middlewares/scraper.middleware'
import { autoInjectable } from 'tsyringe'

@autoInjectable()
class DoujinRoute implements Routes {
  public path = '/doujin/'
  public router = Router()

  constructor(private controller: DoujinController) {
    this.initializeRoutes()
    this.controller = controller
  }

  private initializeRoutes() {
    this.router.get(`${this.path}tag/:query`, ratelimitMiddleware(1), this.controller.tag)
    this.router.get(`${this.path}popular`, ratelimitMiddleware(1), this.controller.popular)
    this.router.get(`${this.path}length`, ratelimitMiddleware(1), this.controller.length)
    this.router.get(`${this.path}age`, ratelimitMiddleware(1), this.controller.age)
    this.router.get(
      `${this.path}:query`,
      ratelimitMiddleware(1),
      cacheMiddleware({ type: 'doujin' }),
      mongoMiddleware({ type: 'doujin' }),
      scraperMiddleware({ type: 'doujin' })
    )
    this.router.get(
      `${this.path}random`,
      ratelimitMiddleware(1),
      cacheMiddleware({ type: 'doujin', random: true }),
      mongoMiddleware({ type: 'doujin' }),
      scraperMiddleware({ type: 'doujin' })
    )
  }
}

export default DoujinRoute
