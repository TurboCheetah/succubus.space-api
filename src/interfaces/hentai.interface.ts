/* eslint-disable camelcase */
export interface Hentai {
  id?: number | string
  name?: string
  titles?: string[]
  slug?: string
  description?: string
  views?: number
  interests?: number
  posterURL?: string
  coverURL?: string
  brand?: string
  brandID?: string
  durationInMs?: number
  isCensored?: boolean
  rating?: string
  likes?: number
  dislikes?: number
  downloads?: number
  monthlyRank?: number
  tags?:
    | {
        id?: number
        text?: string
      }[]
    | string[]
  releasedAt?: string
  url?: string
  streamURL?: string
  malURL?: string
  malID?: number
  updatedAt?: Date
  invalid?: boolean
}
export interface HAnime extends Hentai {
  poster_url?: string
  cover_url?: string
  brand_id?: string
  duration_in_ms?: number
  is_censored?: boolean
  monthly_rank?: number
  created_at?: string
  released_at?: string
  is_visible?: boolean
  is_hard_subtitled?: boolean
  is_banned_in?: string | string[]
  preview_url?: string
  primary_color?: number
  created_at_unix?: Date
  released_at_unix?: Date
}
