/* eslint-disable camelcase */
export interface APIStream {
  id: number
  server_id: number
  slug: string
  kind: string
  extension: string
  mime_type: string
  width: number
  height: string
  duration_in_ms: number
  filesize_mbs: number
  filename: string
  url: string
  is_guest_allowed: boolean
  is_member_allowed: boolean
  is_premium_allowed: boolean
  is_downloadable: boolean
  compatibility: string
  hv_id: number
  server_sequence: number
  video_stream_group_id: string
  extra2: null
}
