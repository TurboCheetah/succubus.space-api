export interface HentaiFranchiseVideoInfo {
  id: number
  name: string
  slug: string
  createdAt: string
  releasedAt: string
  views: number
  interests: number
  posterURL: string
  coverURL: string
  isHardSubtitled: boolean
  brand: string
  durationInMs: number | 0
  isCensored: boolean
  rating: number | null
  likes: number
  dislikes: number
  downloads: number
  monthlyRank: number
  brandID: string
  isBannedIn: string
  previewURL: null
  primaryColor: null
  createdAtUnix: number
  releasedAtUnix: number
}
