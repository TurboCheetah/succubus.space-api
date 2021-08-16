import { scrapeDoujin } from '@utils/util'
import Queue from 'bull'

export const doujinQueue = new Queue('scraper', {
  limiter: {
    max: 1,
    duration: 10000
  }
})

export const processQueue = () => {
  doujinQueue.process(async job => {
    return await scrapeDoujin(job.data.id.toString())
  })
}
