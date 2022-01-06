import { Field, ID, Int, ObjectType } from 'type-graphql'

@ObjectType()
export class hentaiTitles {
  @Field()
  lang: string

  @Field()
  kind: string

  @Field()
  title: string
}

@ObjectType()
export class hentaiBrand {
  @Field(() => ID)
  id: number

  @Field()
  title: string

  @Field()
  slug: string

  @Field()
  websiteURL: string

  @Field()
  logoURL: string

  @Field()
  email: string

  @Field()
  count: number
}

@ObjectType()
export class hentaiTags {
  @Field(() => ID)
  id: number

  @Field()
  text: string
}

@ObjectType()
export class hentaiFranchise {
  @Field(() => ID)
  id: number

  @Field()
  name: string

  @Field()
  slug: string

  @Field()
  title: string
}

@ObjectType()
export class hentaiFranchiseVideo {
  @Field(() => ID)
  id: number

  @Field()
  name: string

  @Field()
  slug: string

  @Field()
  createdAt: string

  @Field()
  releasedAt: string

  @Field()
  views: number

  @Field()
  interests: number

  @Field()
  posterURL: string

  @Field()
  coverURL: string

  @Field()
  isHardSubtitled: boolean

  @Field()
  brand: string

  @Field()
  durationInMs: number

  @Field()
  isCensored: boolean

  @Field()
  rating: number

  @Field()
  likes: number

  @Field()
  dislikes: number

  @Field()
  downloads: number

  @Field()
  monthlyRank: number

  @Field()
  brandID: string

  @Field()
  isBannedIn: string

  @Field()
  previewURL: string

  @Field()
  primaryColor: string

  @Field()
  createdAtUnix: number

  @Field()
  releasedAtUnix: number
}

@ObjectType()
export class hentaiStreams {
  @Field()
  _360p: string

  @Field()
  _480p: string

  @Field()
  _720p: string

  @Field()
  _1080p: string
}

@ObjectType()
export class hentaiType {
  @Field(() => Int)
  id: number

  @Field()
  name: string

  @Field(() => [hentaiTitles])
  titles: hentaiTitles[]

  @Field()
  slug: string

  @Field()
  description: string

  @Field()
  views: number

  @Field()
  interests: number

  @Field()
  posterURL: string

  @Field()
  coverURL: string

  @Field(() => hentaiBrand)
  brand: hentaiBrand

  @Field()
  durationInMs: number

  @Field()
  isCensored: boolean

  @Field()
  rating: string

  @Field()
  likes: number

  @Field()
  dislikes: number

  @Field()
  downloads: number

  @Field()
  monthlyRank: number

  @Field()
  bannedIn: string

  @Field()
  hardSubtitled: boolean

  @Field(() => [hentaiTags])
  tags: hentaiTags[]

  @Field(() => hentaiFranchise)
  franchise: hentaiFranchise

  @Field(() => [hentaiFranchiseVideo])
  franchiseVideos: hentaiFranchiseVideo[]

  @Field()
  releasedAt: string

  @Field()
  url: string

  @Field()
  streams: hentaiStreams

  @Field(() => ID)
  malID: number

  @Field()
  malDescription: string

  @Field(() => String)
  updatedAt: Date
}
