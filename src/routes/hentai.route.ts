import { Router } from 'express'
import { Routes } from '@interfaces/routes.interface'
import HentaiController from '@controllers/hentai.controller'
import cacheMiddleware from '@middlewares/cache.middlewre'
import scraperMiddleware from '@middlewares/scraper.middleware'
import ratelimitMiddleware from '@middlewares/ratelimiter.middleware'

class HentaiRoute implements Routes {
  public path = '/'
  public router = Router()
  public hentaiController = new HentaiController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(`${this.path}hanime/:query`, ratelimitMiddleware(300), this.hentaiController.hanime)
    this.router.get(`${this.path}hentai/:query`, ratelimitMiddleware(1), cacheMiddleware, scraperMiddleware)
    this.router.get(`${this.path}scrape/:query`, ratelimitMiddleware(300), scraperMiddleware)
    this.router.get(`${this.path}random`, ratelimitMiddleware(1), cacheMiddleware, scraperMiddleware)
  }
}

export default HentaiRoute
