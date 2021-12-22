import { ArgsType, Field, Int, ObjectType } from 'type-graphql'

@ObjectType()
export class hentaiFranchise {
  @Field()
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
  @Field()
  id: number

  @Field()
  name: string

  @Field()
  slug: string
}

@ObjectType()
export class hentaiType {
  @Field(() => Int)
  id?: number

  @Field()
  name?: string

  @Field(() => [String])
  titles: string[]

  @Field()
  slug?: string

  @Field()
  description?: string

  @Field()
  views?: number

  @Field()
  interests?: number

  @Field()
  posterURL?: string

  @Field()
  coverURL?: string

  @Field()
  brand?: string

  @Field()
  durationInMs?: number

  @Field()
  isCensored?: boolean

  @Field()
  rating?: string

  @Field()
  likes?: number

  @Field()
  dislikes?: number

  @Field()
  downloads?: number

  @Field()
  monthlyRank?: number

  @Field(() => [String])
  tags?: string[]

  @Field(() => hentaiFranchise)
  franchise: hentaiFranchise

  @Field(() => [hentaiFranchiseVideo])
  franchiseVideos: hentaiFranchiseVideo[]

  @Field()
  releasedAt?: string

  @Field()
  url: string

  @Field()
  streamURL: string

  @Field()
  malURL: string

  @Field(() => Int)
  malID: number

  @Field(() => String)
  updatedAt: Date

  @Field()
  invalid: boolean
}

@ArgsType()
export class hentaiArgs {
  @Field(() => Int)
  id: number

  @Field()
  name: string

  @Field()
  brand: string

  @Field()
  monthlyRank: number

  @Field(() => [String])
  tags: string[]

  @Field(() => Int)
  malID: number

  @Field()
  sortBy: 'views' | 'interests' | 'likes' | 'dislikes' | 'downloads' | 'monthlyRank'

  @Field()
  order: 'asc' | 'desc'
}
