import { Field, ID, ObjectType } from 'type-graphql'

@ObjectType()
export class hentaiType {
  @Field(() => ID)
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

  @Field()
  releasedAt?: string

  @Field()
  url: string

  @Field()
  streamURL: string

  @Field()
  malURL: string

  @Field(() => ID)
  malID: number

  @Field(() => String)
  updatedAt: Date

  @Field()
  invalid: boolean
}
