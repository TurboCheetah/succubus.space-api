/* eslint-disable camelcase */
import hentaiModel from '@/models/hentai.model'
import { Arg, Query, Resolver } from 'type-graphql'
import { hentaiType } from '@resolvers/types/hentai.type'

@Resolver()
export class BrandResolver {
  @Query(() => [hentaiType])
  public async brand(@Arg('brand') producer: string) {
    const data = await hentaiModel.find({ brand: { $regex: producer } })

    return data
  }
}
