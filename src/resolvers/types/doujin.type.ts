import { Field, ID, ObjectType } from 'type-graphql'

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
  @Field(() => ID)
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
