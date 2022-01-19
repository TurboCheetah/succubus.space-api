/* eslint-disable camelcase */
import { myanimelist, sentry } from '#/config'
import { MyAnimeListRawResult } from '#interfaces/MyAnimeList/MyAnimeListRawResult.interface'
import { MyAnimeListResult } from '#interfaces/MyAnimeList/MyAnimeListResult.interface'
import { logger } from '#utils/logger'
import p from 'phin'
import { captureException } from '@sentry/node'
import { singleton } from 'tsyringe'

@singleton()
export class MyAnimeList {
  private clientID: string
  constructor() {
    this.clientID = myanimelist.clientID
  }

  public async search(query: string): Promise<MyAnimeListResult[]> {
    const {
      body: { data }
    } = await p<MyAnimeListRawResult>({
      url: `https://api.myanimelist.net/v2/anime?nsfw=true&q=${query}&fields=alternative_titles, synopsis`,
      headers: { 'X-MAL-Client-ID': this.clientID },
      parse: 'json'
    })

    if (!data) return null

    const hentai = data.map(data => {
      return {
        id: data.node.id,
        titles: [data.node.title, data.node.alternative_titles.en, data.node.alternative_titles.ja, ...data.node.alternative_titles.synonyms],
        synopsis: data.node.synopsis
      }
    })
    for (const h of hentai) h.titles = h.titles.map((title: string) => title.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase())

    return hentai
  }

  public async fetch(title: string): Promise<MyAnimeListResult> {
    try {
      const query = title
        .replace(/\s([\d]+)/i, '')
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .toLowerCase()

      const data = await this.search(query)

      if (!data) return null

      for (const hentai of data) {
        const match = hentai.titles.find((title: string) => {
          return title === query || title.includes(query) || title.replace(/special/, 'extra').includes(query)
        })

        if (match) return hentai
      }

      return null
    } catch (err) {
      logger.error(err)
      if (process.env.NODE_ENV === 'production' && sentry.enabled) captureException(err)
    }
  }
}
