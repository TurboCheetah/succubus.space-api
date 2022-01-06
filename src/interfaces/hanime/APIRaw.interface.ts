/* eslint-disable camelcase */
/*
Thanks to sk-1982 for some of the types
https://github.com/sk-1982/hanime/blob/master/src/api-types/APIVideo.ts
*/

import { APIFranchiseVideoInfo } from '@interfaces/hanime/APIFranchiseVideoInfo'
import { APITags } from '@interfaces/hanime/APITags.interface'
import { APIVideo } from '@interfaces/hanime/APIVideo.interface'

export interface APIRaw extends APIVideo {
  player_base_url: string
  hentai_tags: {
    id: number
    text: APITags
    count: number
    description: string
    wide_image_url: string
    tall_image_url: string
  }[]
  watch_later_playlist_hentai_videos: null | any // TODO
  like_dislike_playlist_hentai_videos: null | any // TODO
  playlist_hentai_videos: null | any // TODO
  similar_playlists_data: {
    playlists: {
      count: number
      created_at: string
      custom_poster_url: string | null
      hentai_video_slug: string
      id: number
      is_mutable: boolean
      poster_url: string
      slug: string
      title: string
      total_duration: number
      total_size: number
      updated_at: string
      user_id: number
      views: number
      visibility: string
    }[]
    users_data: {
      [user: string]: {
        id: number
        name: string
        slug: string
      }
    }
  }
  next_hentai_video: APIFranchiseVideoInfo
  next_random_hentai_video: APIFranchiseVideoInfo
  user_license: null | any // TODO
  bs: any // advertising related stuff
  ap: any
  env: any // mobile app / premium related stuff
  session_token: string
  session_token_expire_time_unix: number
  user: null | any // TODO,
  user_setting: null | any // TODO
  user_search_option: null | any // TODO
  playlists: null | any // TODO
}
