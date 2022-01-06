/* eslint-disable camelcase */
export interface APIFranchiseVideoInfo {
  id: number
  name: string
  slug: string
  created_at: string
  released_at: string
  views: number
  interests: number
  poster_url: string
  cover_url: string
  is_hard_subtitled: boolean
  brand: string
  duration_in_ms: number | 0
  is_censored: boolean
  rating: number | null
  likes: number
  dislikes: number
  downloads: number
  monthly_rank: number
  brand_id: string
  is_banned_in: string
  preview_url: null
  primary_color: null
  created_at_unix: number
  released_at_unix: number
}
