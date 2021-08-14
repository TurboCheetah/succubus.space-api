import { ArgsType, Field, Int, ObjectType } from 'type-graphql'

@ObjectType()
export class doujinTitles {
  @Field()
  english: string

  @Field()
  japanese: string

  @Field()
  pretty: string
}

@ObjectType()
export class doujinType {
  @Field(() => Int)
  id?: number

  @Field(() => doujinTitles)
  titles: doujinTitles

  @Field(() => String)
  uploadDate?: Date

  @Field()
  length?: number

  @Field()
  favorites?: number

  @Field()
  url?: string

  @Field()
  cover?: string

  @Field()
  thumbnail?: string

  @Field(() => [String])
  tags?: string[]

  @Field()
  invalid: boolean
}

@ArgsType()
export class doujinArgs {
  @Field(() => [String])
  tags: string[]

  @Field()
  order: 'asc' | 'desc'

  @Field()
  language: 'english' | 'japanese' | 'chinese'
}
