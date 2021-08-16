import { scrapeHentai } from '@utils/util'
import Queue from 'bull'

export const hentaiQueue = new Queue('scraper', {
  limiter: {
    max: 1,
    duration: 10000
  }
})

export const processQueue = () => {
  hentaiQueue.process(async job => {
    return await scrapeHentai(job.data.id.toString())
  })
}
