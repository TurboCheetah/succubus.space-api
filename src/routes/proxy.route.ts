import { Router } from 'express'
import ProxyController from '#controllers/proxy.controller'
import { Routes } from '#interfaces/routes.interface'
import { autoInjectable } from 'tsyringe'

@autoInjectable()
class ProxyRoute implements Routes {
  public path = '/proxy'
  public router = Router()

  constructor(private controller: ProxyController) {
    this.initializeRoutes()
    this.controller = controller
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.controller.proxy)
  }
}

export default ProxyRoute
