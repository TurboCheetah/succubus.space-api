import { Router } from 'express'
import { Routes } from '@interfaces/routes.interface'
import HentaiController from '@controllers/hentai.controller'
import ratelimitMiddleware from '@middlewares/ratelimiter.middleware'
import cacheMiddleware from '@middlewares/cache.middleware'
import mongoMiddleware from '@middlewares/mongo.middleware'
import scraperMiddleware from '@middlewares/scraper.middleware'
import hentaiModel from '@/models/hentai.model'

class HentaiRoute implements Routes {
  public path = '/'
  public router = Router()
  public hentaiController = new HentaiController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(`${this.path}hanime/:query`, ratelimitMiddleware(300), this.hentaiController.hanime)
    this.router.get(`${this.path}hentai/:query`, ratelimitMiddleware(1), cacheMiddleware, mongoMiddleware, scraperMiddleware)
    this.router.get(`${this.path}mongo`, ratelimitMiddleware(1), async (req, res) => {
      const data = await hentaiModel.find()
      return res.send(data)
    })
    this.router.get(`${this.path}scrape/:query`, ratelimitMiddleware(300), scraperMiddleware)
    this.router.get(`${this.path}random`, ratelimitMiddleware(1), cacheMiddleware, scraperMiddleware)
  }
}

export default HentaiRoute
