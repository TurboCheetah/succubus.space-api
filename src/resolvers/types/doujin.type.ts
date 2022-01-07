import { ArgsType, Field, ID, Int, ObjectType } from 'type-graphql'

@ObjectType()
export class DoujinImageType {
  @Field(() => String)
  public extension: 'png' | 'gif' | 'jpg'

  @Field(() => Int)
  public height: number

  @Field(() => Int)
  public width: number

  @Field(() => String)
  public url: string

  @Field(() => Int)
  public pageNumber: number
}

@ObjectType()
export class DoujinTagType {
  @Field(() => ID)
  public id: number

  @Field(() => String)
  public type: string

  @Field(() => String)
  public name: string

  @Field(() => String)
  public url: string

  @Field(() => Int)
  public count: number
}

@ObjectType()
export class DoujinTagManagerType {
  @Field(() => [DoujinTagType])
  public all: DoujinTagType[]
}

@ObjectType()
export class DoujinTitlesType {
  @Field(() => String)
  public english: string

  @Field(() => String)
  public japanese: string

  @Field(() => String)
  public pretty: string
}

@ObjectType()
export class DoujinType {
  @Field(() => ID)
  public id: number

  @Field(() => Int)
  public mediaId: number

  @Field(() => DoujinTitlesType)
  public titles: DoujinTitlesType

  @Field(() => [DoujinImageType])
  public pages: DoujinImageType[]

  @Field(() => DoujinImageType)
  public cover: DoujinImageType

  @Field(() => DoujinImageType)
  public thumbnail: DoujinImageType

  @Field(() => String)
  public url: string

  @Field(() => String)
  public scanlator: string

  @Field(() => String)
  uploadDate: Date

  @Field(() => Int)
  uploadTimestamp: number

  @Field(() => Int)
  length: number

  @Field(() => Int)
  favorites: number

  @Field(() => DoujinTagManagerType)
  tags: DoujinTagManagerType
}

@ArgsType()
export class DoujinBaseArgs {
  @Field(() => ID)
  id?: number

  @Field()
  name?: string
}

@ArgsType()
export class DoujinTagArgs {
  @Field(() => [String])
  tags: string[]

  @Field()
  order: 'asc' | 'desc'

  @Field()
  language: 'english' | 'japanese' | 'chinese'
}
