import c from '@aero/centra'
import { hanime } from '@utils/hanime'
import { ioRedis, client } from '@databases/redis'
import { cacheData } from '@utils/util'
import { load } from 'cheerio'
import { schedule } from 'node-cron'
import Queue from 'bull'

const queue = new Queue('scraper', {
  redis: {
    host: process.env.REDIS_HOST
  },
  limiter: {
    max: 1,
    duration: 10000
  }
})

queue.process(async job => {
  return await cacheData(job.data.id.toString())
})

schedule('0 * * * *', async () => {
  // Get latest HAnime upload ID
  const $ = await c('https://hanime.tv/')
    .text()
    .then(html => load(html))

  let newestID = $('.elevation-3.mb-3.hvc.item.card').first().find('a').attr('alt')

  newestID = (await hanime(newestID))[0].id

  await ioRedis.set('newestID', newestID)

  console.log(`Beginning to scrape data from ${newestID} entries`)

  // Begin scraping
  const ids = []
  for (let i = 5; i < newestID + 1; i++) ids.push(i)

  ids.forEach(async id => {
    // Check if ID already exists in Redis
    const data = await client.get(id)

    if (!data) {
      return await queue.add({ id })
    }
  })
})