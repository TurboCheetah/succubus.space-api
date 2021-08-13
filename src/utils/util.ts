import { client } from '@databases/redis'
import { HAnime, Hentai } from '@interfaces/hentai.interface'
import { Doujin } from '@interfaces/doujin.interface'
import hentaiModel from '@models/hentai.model'
import doujinModel from '@models/doujin.model'
import { hanime } from '@utils/hanime'
import { mal } from '@utils/mal'
import { nhentai } from '@utils/nhentai'
import { Doujin as nDoujin, SortMethods, Tag } from 'nhentai'
import { logger } from './logger'

export const hentaiBuilder = (data: HAnime): Hentai => {
  return {
    id: data.id,
    name: data.name,
    titles: data.titles,
    slug: data.slug,
    description: data.description,
    views: data.views,
    interests: data.interests,
    posterURL: data.poster_url ? data.poster_url : data.posterURL,
    coverURL: data.cover_url ? data.cover_url : data.coverURL,
    brand: data.brand,
    brandID: data.brand_id ? data.brand_id : data.brandID,
    durationInMs: data.duration_in_ms ? data.duration_in_ms : data.durationInMs,
    isCensored: data.is_censored !== undefined ? data.is_censored : data.isCensored,
    rating: data.rating,
    likes: data.likes,
    dislikes: data.dislikes,
    downloads: data.downloads,
    monthlyRank: data.monthly_rank ? data.monthly_rank : data.monthlyRank,
    tags: data.tags,
    releasedAt: data.released_at ? data.released_at : data.releasedAt,
    url: data.url,
    streamURL: data.streamURL,
    malID: data.malID ? data.malID : null
  }
}

export const doujinBuilder = (data: nDoujin | Doujin): Doujin => {
  return {
    id: data.id,
    titles: data.titles,
    uploadDate: data.uploadDate,
    length: data.length,
    favorites: data.favorites,
    url: data.url,
    cover: (data.cover as any).url ? (data.cover as any).url : data.cover,
    thumbnail: (data.thumbnail as any).url ? (data.thumbnail as any).url : data.thumbnail,
    tags: (data.tags as any).all ? (data.tags as any).all.map((tag: Tag) => tag.name) : data.tags
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
    const search = isNaN(+query) ? (await nhentai.search(query, 1, SortMethods.POPULAR_ALL_TIME)).doujins[0] : await nhentai.fetchDoujin(query)

    // If no results save to cache with invalid property
    if (!search) {
      await client.set(`doujin_${query}`, { id: query, invalid: true }, { expire: 86400 })
      return { id: query, invalid: true }
    }

    const data = doujinBuilder(search)

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
  }
}
