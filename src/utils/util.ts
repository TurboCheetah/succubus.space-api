import { HAnime, Hentai } from '@/interfaces/hentai.interface'
import hentaiModel from '@/models/hentai.model'
import { client } from '@databases/redis'
import { hanime } from '@utils/hanime'
import { mal } from '@utils/mal'

export const dataBuilder = (data: HAnime): Hentai => {
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

export const scrapeData = async (query: string): Promise<Hentai> => {
  let hanimeTitle: string

  const hanimeSearch = await hanime(query)

  // If no results save to cache with invalid property
  if (hanimeSearch.invalid) {
    await client.set(query, { id: query, invalid: true }, { expire: 86400 })
    return { id: query, invalid: true }
  }

  if (hanimeSearch.titles.length < 1) {
    hanimeTitle = hanimeSearch.name
  } else {
    hanimeTitle = hanimeSearch.titles[0]
  }

  let malSearch = await mal(isNaN(+query) ? query : hanimeTitle)

  if (!malSearch) {
    malSearch = await mal(hanimeSearch.name)
  }

  if (malSearch) {
    hanimeSearch.description = malSearch.synopsis
    hanimeSearch.malID = malSearch.id
  }

  const data: Hentai = dataBuilder(hanimeSearch)

  isNaN(+query) ? await client.set(query, data, { expire: 3600 }) : await client.set(hanimeSearch.id.toString(), data, { expire: 3600 })

  if (await hentaiModel.findOne({ id: data.id })) {
    await hentaiModel.updateOne({ id: data.id }, data)
    return data
  } else {
    await hentaiModel.create(data)
  }

  return data
}
