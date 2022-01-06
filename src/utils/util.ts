import { client } from '@databases/redis'
import { HentaiInvalid } from '@interfaces/hentai/HentaiInvalid.interface'
import { Hentai } from '@interfaces/hentai/Hentai.interface'
import { DoujinInvalid } from '@interfaces/doujin/DoujinInvalid.interface'
import hentaiModel from '@models/hentai.model'
import doujinModel from '@models/doujin.model'
import { hanime } from '@utils/hanime'
import { mal } from '@utils/mal'
import { nhentai } from '@utils/nhentai'
import { Doujin, SortMethods } from 'nhentai'
import { logger } from './logger'
import { sentry } from '@/config'
import { captureException } from '@sentry/node'

export const scrapeHentai = async (query: string): Promise<Hentai | HentaiInvalid> => {
  const rawData = await hanime(query)
  // console.log(rawData, 'rawData')

  // If no results save to cache with invalid property
  if (!rawData) {
    await client.set(`hentai_${query}`, { id: query, invalid: true }, { expire: 86400 })
    return { query, invalid: true }
  }

  let malSearch = await mal(isNaN(+query) ? query : rawData.hentai_video.name)
  // console.log(malSearch, 'malSearch')

  if (!malSearch && rawData.hentai_video.titles.length > 0) malSearch = await mal(rawData.hentai_video.titles[0].title)
  // console.log(malSearch, 'malSearch')

  const data = new Hentai(rawData, malSearch)
  // console.log(data, 'data')

  await client.set(`hentai_${data.id}`, data, { expire: 3600 })

  if (await hentaiModel.findOne({ id: data.id })) {
    await hentaiModel.updateOne({ id: data.id }, data)
    return data
  } else {
    await hentaiModel.create(data)
  }

  return data
}

export const scrapeDoujin = async (query: string): Promise<Doujin | DoujinInvalid> => {
  try {
    const data = isNaN(+query) ? (await nhentai.search(query, 1, SortMethods.POPULAR_ALL_TIME)).doujins[0] : await nhentai.fetchDoujin(query)

    // If no results save to cache with invalid property to prevent having to look up invalid data for the next 24 hours
    if (!data) {
      await client.set(`doujin_${query}`, { query, invalid: true }, { expire: 86400 })
      return data
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
