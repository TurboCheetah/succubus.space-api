/* eslint-disable camelcase */
import { APIFranchiseVideoInfo } from '#interfaces/hanime/APIFranchiseVideoInfo'
import { APITags } from '#interfaces/hanime/APITags.interface'
import { APITitle } from '#interfaces/hanime/APITitle.interface'

export interface APIVideoInfo extends APIFranchiseVideoInfo {
  is_visible: boolean
  description: string
  hentai_tags: {
    id: number
    text: APITags
  }[]
  titles: APITitle[]
}
