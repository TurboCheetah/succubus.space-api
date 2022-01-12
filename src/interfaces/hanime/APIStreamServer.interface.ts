import { APIStream } from '#interfaces/hanime/APIStream.interface'

/* eslint-disable camelcase */
export interface APIStreamServer {
  id: number
  name: string
  slug: string
  na_rating: string
  eu_rating: string
  asia_rating: string
  sequence: number
  is_permanent: boolean
  streams: APIStream[]
}
