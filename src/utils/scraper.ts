import c from '@aero/centra'
import { hanime } from '@utils/hanime'
import { ioRedis, client } from '@databases/redis'
import { load } from 'cheerio'
import { schedule } from 'node-cron'
import { logger } from '@utils/logger'
import { nhentai } from '@utils/nhentai'
import { hentaiQueue, processQueue as processHentai } from '@queues/hentai.queue'
import { doujinQueue, processQueue as processDoujin } from '@queues/doujin.queue'

processHentai()
processDoujin()

schedule('0 * * * *', async () => {
  try {
    const oldNewest = await ioRedis.get('hentai_newestID')

    // Get latest HAnime upload ID
    const $ = await c('https://hanime.tv/')
      .text()
      .then(html => load(html))

    let newestID = $('.elevation-3.mb-3.hvc.item.card').first().find('a').attr('alt')

    newestID = (await hanime(newestID)).id

    await ioRedis.set('hentai_newestID', newestID)

    logger.info(`Beginning to scrape data from ${newestID - +oldNewest} new entries`)

    // Begin scraping
    const ids = []
    for (let i = 5; i < newestID + 1; i++) ids[i] = i

    ids.forEach(async id => {
      // Check if ID already exists in Redis
      const data = await client.get(`hentai_${id}`)

      if (!data) {
        return await hentaiQueue.add({ id })
      }
    })
  } catch (err) {
    logger.error(err)
  }
})

schedule('* * * * *', async () => {
  try {
    const oldNewest = await ioRedis.get('doujin_newestID')
    const lastScraped = await ioRedis.get('doujin_lastScraped')

    let newestID: number

    // Get latest Doujin ID
    const nh = await nhentai.fetchHomepage()

    newestID = nh.doujins[0].id

    if (newestID - +oldNewest > 5000) newestID = +lastScraped + 5000

    await ioRedis.set('doujin_newestID', newestID)

    logger.info(`Beginning to scrape data from ${newestID - +oldNewest} new entries`)

    // Begin scraping
    const ids = []
    for (let i = 0; i < newestID + 1; i++) ids[i] = i + 1

    ids.forEach(async id => {
      // Check if ID already exists in Redis
      const data = await client.get(`doujin_${id}`)

      if (!data) {
        return await doujinQueue.add({ id })
      }
    })
  } catch (err) {
    logger.error(err)
  }
})
