import { Router } from 'express'
import IndexController from '@controllers/index.controller'
import { Routes } from '@interfaces/routes.interface'
import { autoInjectable } from 'tsyringe'

@autoInjectable()
class IndexRoute implements Routes {
  public path = '/'
  public router = Router()

  constructor(private controller: IndexController) {
    this.initializeRoutes()
    this.controller = controller
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.controller.index)
  }
}

export default IndexRoute
