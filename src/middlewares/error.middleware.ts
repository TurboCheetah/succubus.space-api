import { HttpException } from '@exceptions/HttpException'
import { logger } from '@utils/logger'
import { NextFunction, Request, Response } from 'express'
import { captureException } from '@sentry/node'
import { sentry } from '@/config'

const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = error.status || 500
    const message: string = error.message || 'Something went wrong'

    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`)
    res.status(status).json({ message })
    if (process.env.NODE_ENV === 'production' && sentry.enabled) captureException(error)
  } catch (error) {
    next(error)
  }
}

export default errorMiddleware
