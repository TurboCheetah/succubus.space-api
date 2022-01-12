import 'reflect-metadata'
import { app, log, sentry } from '#/config'
import { dbConnection } from '#databases/mongo'
import { ioRedis } from '#databases/redis'
import { Routes } from '#interfaces/routes.interface'
import errorMiddleware from '#middlewares/error.middleware'
import { DoujinResolver } from '#resolvers/doujin.resolver'
import { HentaiResolver } from '#resolvers/hentai.resolver'
import { logger, stream } from '#utils/logger'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { BaseRedisCache } from 'apollo-server-cache-redis'
import { ApolloServer } from 'apollo-server-express'
import compression from 'compression'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import hpp from 'hpp'
import { connect, set } from 'mongoose'
import morgan from 'morgan'
import { buildSchema } from 'type-graphql'
import { Handlers, init } from '@sentry/node'

class App {
  public app: express.Application
  public port: string | number
  public env: string

  constructor(routes: Routes[]) {
    this.app = express()
    this.port = app.port
    this.env = process.env.NODE_ENV

    this.app.set('trust proxy', true)
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

  private async initializeMiddlewares() {
    if (process.env.NODE_ENV === 'production' && sentry.enabled) {
      init({
        dsn: sentry.dsn,
        autoSessionTracking: true,
        tracesSampleRate: 1.0
      })

      this.app.use(Handlers.requestHandler({ serverName: false }) as express.RequestHandler)
    }

    this.app.use(morgan(log.format, { stream }))
    const apollo = new ApolloServer({
      schema: await buildSchema({ resolvers: [HentaiResolver, DoujinResolver], nullableByDefault: true }),
      cache: new BaseRedisCache({ client: ioRedis }),
      introspection: true,
      plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
      context: ({ req, res }) => ({ req, res })
    })
    await apollo.start()
    apollo.applyMiddleware({ app: this.app, cors: true })
    this.app.use(cors())
    this.app.use(hpp())
    this.app.use(helmet())
    this.app.use(compression())
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router)
    })
  }

  private initializeErrorHandling() {
    this.app.use(Handlers.errorHandler() as express.ErrorRequestHandler)
    this.app.use(errorMiddleware)
  }
}

export default App
