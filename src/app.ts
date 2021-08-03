import { app, monitor as mon, log } from '@/config'
import compression from 'compression'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import hpp from 'hpp'
import morgan from 'morgan'
import monitor from 'express-status-monitor'
import { connect, set } from 'mongoose'
import { dbConnection } from '@databases/mongo'
import { Routes } from '@interfaces/routes.interface'
import errorMiddleware from '@middlewares/error.middleware'
import { logger, stream } from '@utils/logger'

class App {
  public app: express.Application
  public port: string | number
  public env: string

  constructor(routes: Routes[]) {
    this.app = express()
    this.port = app.port
    this.env = process.env.NODE_ENV

    this.connectToDatabase()
    this.initializeMiddlewares()
    this.initializeRoutes(routes)
    this.initializeErrorHandling()
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`)
      logger.info(`======= ENV: ${this.env} =======`)
      logger.info(`🚀 App listening on the port ${this.port}`)
      logger.info(`=================================`)
    })
  }

  public getServer() {
    return this.app
  }

  private connectToDatabase() {
    if (this.env !== 'production') set('debug', true)

    connect(dbConnection.url, dbConnection.options)
  }

  private initializeMiddlewares() {
    if (mon.enabled) {
      this.app.use(
        monitor({
          title: app.name,
          path: mon.route,
          healthChecks: [
            {
              protocol: 'http',
              host: 'localhost',
              path: '/hentai/1226',
              port: '4445'
            }
          ]
        })
      )
    }

    this.app.use(morgan(log.format, { stream }))
    this.app.use(cors())
    this.app.use(hpp())
    this.app.use(helmet())
    this.app.use(compression())
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router)
    })
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware)
  }
}

export default App
