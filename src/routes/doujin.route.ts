import { Router } from 'express'
import { Routes } from '@interfaces/routes.interface'
import DoujinController from '@controllers/doujin.controller'
import ratelimitMiddleware from '@middlewares/ratelimiter.middleware'
import cacheMiddleware from '@middlewares/cache.middleware'
import mongoMiddleware from '@middlewares/mongo.middleware'
import scraperMiddleware from '@middlewares/scraper.middleware'

class DoujinRoute implements Routes {
  public path = '/doujin/'
  public router = Router()
  public doujinController = new DoujinController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(`${this.path}tag/:query`, ratelimitMiddleware(1), this.doujinController.tag)
    this.router.get(`${this.path}popular`, ratelimitMiddleware(1), this.doujinController.popular)
    this.router.get(`${this.path}length`, ratelimitMiddleware(1), this.doujinController.length)
    this.router.get(`${this.path}age`, ratelimitMiddleware(1), this.doujinController.age)
    this.router.get(`${this.path}:query`, ratelimitMiddleware(1), cacheMiddleware({ type: 'doujin' }), mongoMiddleware, scraperMiddleware)
    this.router.get(
      `${this.path}random`,
      ratelimitMiddleware(1),
      cacheMiddleware({ type: 'doujin', random: true }),
      mongoMiddleware,
      scraperMiddleware
    )
  }
}

export default DoujinRoute
