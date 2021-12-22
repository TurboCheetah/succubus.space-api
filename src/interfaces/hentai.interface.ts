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
  franchise?: {
    id?: number
    name?: string
    slug?: string
    title?: string
  }
  franchiseVideos?: {
    id?: number
    name?: string
    slug?: string
  }[]
  releasedAt?: Date
  url?: string
  streamURL?: {
    _480p?: string
    _360p?: string
    _720p?: string
    _1080p?: string
  }
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
  released_at?: Date
  is_visible?: boolean
  is_hard_subtitled?: boolean
  is_banned_in?: string | string[]
  preview_url?: string
  primary_color?: number
  created_at_unix?: Date
  released_at_unix?: Date
}
