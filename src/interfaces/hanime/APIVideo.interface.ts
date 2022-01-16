/* eslint-disable camelcase */
import { APIBrand } from '#interfaces/hanime/APIBrand.interface'
import { APIFranchise } from '#interfaces/hanime/APIFranchise.interface'
import { APIFranchiseVideoInfo } from '#interfaces/hanime/APIFranchiseVideoInfo'
import { APIRaw } from '#interfaces/hanime/APIRaw.interface'
import { APIStoryboard } from '#interfaces/hanime/APIStoryboard.interface'
import { APIVideoInfo } from '#interfaces/hanime/APIVideoInfo.interface'
import { APIVideoManifest } from '#interfaces/hanime/APIVideoManifest.interface'

export interface APIVideo {
  hentai_video: APIVideoInfo
  hentai_franchise: APIFranchise
  hentai_franchise_hentai_videos: APIFranchiseVideoInfo[]
  hentai_video_storyboards: APIStoryboard[]
  brand: APIBrand
  videos_manifest: APIVideoManifest
}

export class APIVideo {
  constructor(raw: APIRaw) {
    this.hentai_video = raw.hentai_video
    this.hentai_video.description = this.hentai_video.description.replace(/<br>/g, '\n').replace(/<[^>]*>?/gm, '')
    this.hentai_franchise = raw.hentai_franchise
    this.hentai_franchise_hentai_videos = raw.hentai_franchise_hentai_videos
    this.hentai_video_storyboards = raw.hentai_video_storyboards
    this.brand = raw.brand
    this.videos_manifest = raw.videos_manifest
  }
}
