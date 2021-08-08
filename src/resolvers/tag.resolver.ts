import hentaiModel from '@/models/hentai.model'
import { Arg, Query, Resolver } from 'type-graphql'
import { hentaiType } from '@resolvers/types/hentai.type'

@Resolver()
export class TagResolver {
  @Query(() => [hentaiType])
  public async tag(@Arg('tag') tag: string) {
    const data = await hentaiModel.find({ tags: { $regex: tag } })

    return data
  }
}
