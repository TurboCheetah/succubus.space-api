import { client } from '@databases/redis'
import { Hentai } from '@interfaces/hentai/Hentai.interface'
import hentaiModel from '@models/hentai.model'
import doujinModel from '@models/doujin.model'
import { hanime } from '@utils/hanime'
import { MyAnimeList } from '@utils/mal'
import { nhentai } from '@utils/nhentai'
import { Doujin, SortMethods } from 'nhentai'
import { logger } from './logger'
import { sentry } from '@/config'
import { captureException } from '@sentry/node'
import { autoInjectable, singleton } from 'tsyringe'

@autoInjectable()
@singleton()
export class Utils {
  constructor(private mal: MyAnimeList) {
    this.mal = new MyAnimeList()
  }

  public async scrapeHentai(query: string): Promise<Hentai> {
    const rawData = await hanime(query)

    // If no results save to cache with invalid property
    if (!rawData) {
      await client.set(`hentai_${query}`, { id: query, invalid: true }, { expire: 86400 })
      return null
    }

    let malSearch = await this.mal.fetch(isNaN(+query) ? query : rawData.hentai_video.name)

    if (!malSearch && rawData.hentai_video.titles.length > 0) malSearch = await this.mal.fetch(rawData.hentai_video.titles[0].title)

    const data = new Hentai(rawData, malSearch)

    await client.set(`hentai_${data.id}`, data, { expire: 3600 })

    if (await hentaiModel.findOne({ id: data.id })) {
      await hentaiModel.updateOne({ id: data.id }, data)
      return data
    } else {
      await hentaiModel.create(data)
    }

    return data
  }

  public async scrapeDoujin(query: string): Promise<Doujin> {
    try {
      const data = isNaN(+query) ? (await nhentai.search(query, 1, SortMethods.POPULAR_ALL_TIME)).doujins[0] : await nhentai.fetchDoujin(query)

      // If no results save to cache with invalid property to prevent having to look up invalid data for the next 24 hours
      if (!data) {
        await client.set(`doujin_${query}`, { query, invalid: true }, { expire: 86400 })
        return null
      }

      await client.set(`doujin_${data.id}`, data, { expire: 3600 })

      if (await doujinModel.findOne({ id: data.id })) {
        await doujinModel.updateOne({ id: data.id }, data)
        return data
      } else {
        await doujinModel.create(data)
      }

      return data
    } catch (err) {
      logger.error(err)
      if (process.env.NODE_ENV === 'production' && sentry.enabled) captureException(err)
    }
  }
}
