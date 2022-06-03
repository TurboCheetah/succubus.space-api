import { APIRaw } from '#interfaces/hanime/APIRaw.interface'
import { APISearch } from '#interfaces/hanime/APISearch.interface'
import { APIVideo } from '#interfaces/hanime/APIVideo.interface'
import { LANDING_URL, SEARCH_URL, VIDEO_API_URL } from '#interfaces/constants'
import p from 'phin'
import { APIVideoInfo } from '#interfaces/hanime/APIVideoInfo.interface'
import { ioRedis } from '#databases/redis'

export const hanime = async (query: string | number): Promise<APIVideo> => {
  const search = async (query: string) => {
    const config = {
      search_text: query,
      tags: [],
      tags_mode: 'AND',
      brands: [],
      blacklist: [],
      order_by: 'created_at_unix',
      ordering: 'desc'
    }

    const { body: results } = await p<APISearch>({
      url: SEARCH_URL,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify(config),
      parse: 'json'
    })

    return results
  }

  if (isNaN(+query)) {
    const results = await search(query as string)

    if (results.nbHits > 0) {
      const parsedResults: APIVideoInfo[] = JSON.parse(results.hits)
      query = parsedResults[0].id
    } else {
      return null
    }
  }
  const { body: data } = await p<APIRaw>({ url: `${VIDEO_API_URL}?id=${query}`, parse: 'json' })

  if (!data.hentai_video) return null

  return new APIVideo(data)
}

// Get latest HAnime upload ID
export const getLatest = async (): Promise<number> => {
  const {
    body: {
      sections: [
        {
          hentai_video_ids: [newestID]
        }
      ]
    }
  } = await p<{
    sections: [
      {
        // eslint-disable-next-line camelcase
        hentai_video_ids: number[]
      }
    ]
  }>({ url: LANDING_URL, parse: 'json' })

  await ioRedis.set('hentai_newestID', newestID)

  return +newestID
}
