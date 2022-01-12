import { APITitle } from '#interfaces/hanime/APITitle.interface'
import { APITags } from '#interfaces/hanime/APITags.interface'
import { APIFranchise } from '#interfaces/hanime/APIFranchise.interface'
import { APIVideo } from '#interfaces/hanime/APIVideo.interface'
import { HentaiBrand } from '#interfaces/hentai/HentaiBrand.interface'
import { HentaiFranchiseVideoInfo } from '#interfaces/hentai/HentaiFranchiseVideoInfo.interface'
import { MyAnimeListResult } from '#interfaces/MyAnimeList/MyAnimeListResult.interface'
import { VIDEO_URL } from '#interfaces/constants'

export interface Hentai {
  id: number
  name: string
  titles: APITitle[]
  slug: string
  description: string
  views: number
  interests: number
  posterURL: string
  coverURL: string
  brand: HentaiBrand
  durationInMs: number
  isCensored: boolean
  rating: number | null
  likes: number
  dislikes: number
  downloads: number
  monthlyRank: number
  bannedIn: string
  hardSubtitled: boolean
  tags: {
    id: number
    text: APITags
  }[]
  franchise: APIFranchise
  franchiseVideos: HentaiFranchiseVideoInfo[]
  releasedAt: string
  url: string
  streams: {
    _360p: string
    _480p: string
    _720p: string
    _1080p: string
  }
  malID: number | null
  malDescription: string | null
}

export class Hentai implements Hentai {
  constructor(raw: APIVideo, mal?: MyAnimeListResult) {
    this.id = raw.hentai_video.id
    this.name = raw.hentai_video.name
    this.titles = raw.hentai_video.titles
    this.slug = raw.hentai_video.slug
    this.description = raw.hentai_video.description
    this.views = raw.hentai_video.views
    this.interests = raw.hentai_video.interests
    this.posterURL = raw.hentai_video.poster_url
    this.coverURL = raw.hentai_video.cover_url
    this.brand = {
      id: raw.brand.id,
      title: raw.brand.title,
      slug: raw.brand.slug,
      websiteURL: raw.brand.website_url,
      logoURL: raw.brand.logo_url,
      email: raw.brand.email,
      count: raw.brand.count
    }
    this.durationInMs = raw.hentai_video.duration_in_ms
    this.isCensored = raw.hentai_video.is_censored
    this.rating = raw.hentai_video.rating
    this.likes = raw.hentai_video.likes
    this.dislikes = raw.hentai_video.dislikes
    this.downloads = raw.hentai_video.downloads
    this.monthlyRank = raw.hentai_video.monthly_rank
    this.bannedIn = raw.hentai_video.is_banned_in
    this.hardSubtitled = raw.hentai_video.is_hard_subtitled
    this.tags = raw.hentai_video.hentai_tags
    this.franchise = raw.hentai_franchise
    this.franchiseVideos = raw.hentai_franchise_hentai_videos.map(franchiseVideo => {
      return {
        id: franchiseVideo.id,
        name: franchiseVideo.name,
        slug: franchiseVideo.slug,
        createdAt: franchiseVideo.created_at,
        releasedAt: franchiseVideo.released_at,
        views: franchiseVideo.views,
        interests: franchiseVideo.interests,
        posterURL: franchiseVideo.poster_url,
        coverURL: franchiseVideo.cover_url,
        isHardSubtitled: franchiseVideo.is_hard_subtitled,
        brand: franchiseVideo.brand,
        durationInMs: franchiseVideo.duration_in_ms,
        isCensored: franchiseVideo.is_censored,
        rating: franchiseVideo.rating,
        likes: franchiseVideo.likes,
        dislikes: franchiseVideo.dislikes,
        downloads: franchiseVideo.downloads,
        monthlyRank: franchiseVideo.monthly_rank,
        brandID: franchiseVideo.brand_id,
        isBannedIn: franchiseVideo.is_banned_in,
        previewURL: franchiseVideo.preview_url,
        primaryColor: franchiseVideo.primary_color,
        createdAtUnix: franchiseVideo.created_at_unix,
        releasedAtUnix: franchiseVideo.released_at_unix
      }
    })
    this.releasedAt = raw.hentai_video.released_at
    this.url = `${VIDEO_URL}/${this.slug}`
    this.streams = {
      _360p: raw.videos_manifest.servers[0].streams.find(stream => stream.height === '360')?.url || null,
      _480p: raw.videos_manifest.servers[0].streams.find(stream => stream.height === '480')?.url || null,
      _720p: raw.videos_manifest.servers[0].streams.find(stream => stream.height === '720')?.url || null,
      _1080p: raw.videos_manifest.servers[0].streams.find(stream => stream.height === '1080')?.url || null
    }
    this.malID = mal?.id
    this.malDescription = mal?.synopsis
  }
}
