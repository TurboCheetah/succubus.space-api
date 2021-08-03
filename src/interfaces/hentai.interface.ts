/* eslint-disable camelcase */
export interface Hentai {
  id?: number | string
  name?: string
  slug?: string
  created_at?: string
  released_at?: string
  description?: string
  views?: number
  interests?: number
  poster_url?: string
  cover_url?: string
  is_hard_subtitled?: boolean
  brand?: string
  duration_in_ms?: number
  is_censored?: boolean
  rating?: string
  likes?: number
  dislikes?: number
  downloads?: number
  monthly_rank?: number
  brand_id?: string
  is_banned_in?: string
  preview_url?: string
  primary_color?: number
  created_at_unix?: Date
  released_at_unix?: Date
  hentai_tags?: { id?: number; text?: string }[]
  titles?:
    | {
        lang?: string
        kind?: string
        title?: string
      }[]
    | string[]
  url?: URL
  streamURL?: URL
  tags?:
    | {
        id?: number
        text?: string
      }[]
    | string[]
  malURL?: URL | string
  malID?: number | string
  invalid?: boolean
}
