import { client } from '@databases/redis'
import { HAnime, Hentai } from '@interfaces/hentai.interface'
import { Doujin } from '@interfaces/doujin.interface'
import hentaiModel from '@models/hentai.model'
import doujinModel from '@models/doujin.model'
import { hanime } from '@utils/hanime'
import { mal } from '@utils/mal'
import { nhentai } from '@utils/nhentai'
import { SortMethods } from 'nhentai'
import { logger } from './logger'
import { sentry } from '@/config'
import { captureException } from '@sentry/node'

export const hentaiBuilder = (data: HAnime): Hentai => {
  return {
    id: data.id,
    name: data.name,
    titles: data.titles,
    slug: data.slug,
    description: data.description,
    views: data.views,
    interests: data.interests,
    posterURL: data.poster_url || data.posterURL,
    coverURL: data.cover_url || data.coverURL,
    brand: data.brand,
    brandID: data.brand_id || data.brandID,
    durationInMs: data.duration_in_ms || data.durationInMs,
    isCensored: data.is_censored !== undefined ? data.is_censored : data.isCensored,
    rating: data.rating,
    likes: data.likes,
    dislikes: data.dislikes,
    downloads: data.downloads,
    monthlyRank: data.monthly_rank || data.monthlyRank,
    tags: data.tags,
    franchise: {
      id: data.franchise.id,
      name: data.franchise.name,
      slug: data.franchise.slug,
      title: data.franchise.title
    },
    franchiseVideos: data.franchiseVideos.map(franchiseVideo => {
      return {
        id: franchiseVideo.id,
        name: franchiseVideo.name,
        slug: franchiseVideo.slug
      }
    }),
    releasedAt: data.released_at || data.releasedAt,
    url: data.url,
    streamURL: {
      _360p: data.streamURL._360p,
      _480p: data.streamURL._480p,
      _720p: data.streamURL._720p,
      _1080p: data.streamURL._1080p
    },
    malID: data.malID
  }
}

export const scrapeHentai = async (query: string): Promise<Hentai> => {
  const hanimeSearch = await hanime(query)

  // If no results save to cache with invalid property
  if (hanimeSearch.invalid) {
    await client.set(`hentai_${query}`, { id: query, invalid: true }, { expire: 86400 })
    return { id: query, invalid: true }
  }

  let malSearch = await mal(isNaN(+query) ? query : hanimeSearch.name)

  if (!malSearch && hanimeSearch.titles.length > 1) {
    malSearch = await mal(hanimeSearch.titles[0])
  }

  if (malSearch) {
    hanimeSearch.description = malSearch.synopsis
    hanimeSearch.malID = malSearch.id
  }

  const data: Hentai = hentaiBuilder(hanimeSearch)

  await client.set(`hentai_${data.id}`, data, { expire: 3600 })

  if (await hentaiModel.findOne({ id: data.id })) {
    await hentaiModel.updateOne({ id: data.id }, data)
    return data
  } else {
    await hentaiModel.create(data)
  }

  return data
}

export const scrapeDoujin = async (query: string): Promise<Doujin> => {
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
