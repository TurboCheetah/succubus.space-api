/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
import { Hentai } from '@/interfaces/hentai.interface'
import { client } from '@databases/redis'
import { hanime } from '@utils/hanime'
import malScraper, { malInfoFromName } from 'mal-scraper'

export const shorten = (text: string, maxLen = 1024) => {
  return text.length > maxLen ? `${text.substr(0, maxLen - 3)}...` : text
}

export const mal = async (query: string): Promise<malInfoFromName> => {
  const malData = await malScraper.getInfoFromName(query)

  return malData
}

export const cacheData = async (query: string): Promise<Hentai> => {
  let hanimeTitle

  try {
    let hanimeSearch = await hanime(query)

    // If no results save to cache with invalid property
    if (hanimeSearch.invalid) {
      await client.set(query, { id: query, invalid: true }, { expire: 86400 })
      return { id: query, invalid: true }
    }

    if (isNaN(+query)) hanimeSearch = hanimeSearch[0]

    if (hanimeSearch.titles.length < 1) {
      hanimeTitle = hanimeSearch.name
    } else {
      hanimeTitle = hanimeSearch.titles[0]
    }

    let malSearch = await mal(isNaN(+query) ? shorten(query, 100) : shorten(hanimeTitle, 100))

    if (malSearch.producers[0] !== hanimeSearch.brand) {
      malSearch = await mal(hanimeSearch.name)
    }

    if (!malSearch) {
      return hanimeSearch
    }

    const malProducers = malSearch.producers

    malProducers.forEach(producer => {
      if (producer === hanimeSearch.brand) {
        hanimeSearch.description = malSearch.synopsis.replace(/\n\n\[Written by MAL Rewrite\]/g, '')
        hanimeSearch.malURL = malSearch.url
        hanimeSearch.malID = malSearch.id
      }
    })

    const data = {
      id: hanimeSearch.id,
      name: hanimeSearch.name,
      titles: hanimeSearch.titles,
      slug: hanimeSearch.slug,
      description: hanimeSearch.description,
      views: hanimeSearch.views,
      interests: hanimeSearch.interests,
      poster_url: hanimeSearch.poster_url,
      cover_url: hanimeSearch.cover_url,
      brand: hanimeSearch.brand,
      brand_id: hanimeSearch.brand_id,
      duration_in_ms: hanimeSearch.duration_in_ms,
      is_censored: hanimeSearch.is_censored,
      rating: hanimeSearch.rating,
      likes: hanimeSearch.likes,
      dislikes: hanimeSearch.dislikes,
      downloads: hanimeSearch.downloads,
      monthly_rank: hanimeSearch.monthly_rank,
      tags: hanimeSearch.tags,
      created_at: hanimeSearch.created_at,
      released_at: hanimeSearch.released_at,
      url: hanimeSearch.url,
      streamURL: hanimeSearch.streamURL,
      malURL: hanimeSearch.malURL ? hanimeSearch.malURL : 'Hentai is not on MAL',
      malID: hanimeSearch.malID ? hanimeSearch.malID : 'Hentai is not on MAL'
    }

    isNaN(+query) ? await client.set(query, data, { expire: 86400 }) : await client.set(hanimeSearch.id.toString(), data)

    return hanimeSearch
  } catch (err) {
    console.error(err)
  }
}
