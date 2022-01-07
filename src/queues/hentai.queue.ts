import { Utils } from '@utils/util'
import Queue from 'bull'
import { container } from 'tsyringe'

export const hentaiQueue = new Queue('scraper', {
  redis: {
    host: process.env.REDIS_HOST
  },
  limiter: {
    max: 1,
    duration: 10000
  }
})

export const processQueue = () => {
  hentaiQueue.process(async job => {
    return await container.resolve(Utils).scrapeHentai(job.data.id.toString())
  })
}
