import { myanimelist, sentry } from '@/config'
import { MALResult } from '@/interfaces/MAL.interface'
import { logger } from '@utils/logger'
import c from '@aero/centra'
import { captureException } from '@sentry/node'

export const malAuth = async (clientID: string, username: string, password: string) => {
  // eslint-disable-next-line camelcase
  const { access_token, refresh_token } = await c('https://api.myanimelist.net/v2/auth/token', 'POST')
    .body(
      {
        client_id: clientID,
        username,
        password,
        grant_type: 'password'
      },
      'form'
    )
    .json()

  return { access_token, refresh_token }
}

export const search = async (query: string): Promise<MALResult[]> => {
  const auth = await malAuth(myanimelist.clientID, myanimelist.username, myanimelist.password)

  const { data } = await c('https://api.myanimelist.net/v2/anime', 'GET')
    .query({
      nsfw: true,
      q: query,
      fields: 'alternative_titles, synopsis'
    })
    .header('authorization', `Bearer ${auth.access_token}`)
    .json()

  if (!data) return undefined

  const hentai = data.map(
    // eslint-disable-next-line camelcase
    (data: { node: { id: number; title: string; alternative_titles: { en: string; ja: string; synonyms: string[] }; synopsis: string } }) => {
      return {
        id: data.node.id,
        titles: [data.node.title, data.node.alternative_titles.en, data.node.alternative_titles.ja, ...data.node.alternative_titles.synonyms],
        synopsis: data.node.synopsis
      }
    }
  )
  for (const h of hentai) h.titles = h.titles.map((title: string) => title.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase())

  return hentai
}

export const mal = async (title: string): Promise<MALResult> => {
  try {
    const query = title
      .replace(/\s([\d]+)/i, '')
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .toLowerCase()

    const data = await search(query)

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
