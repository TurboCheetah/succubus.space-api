import hentaiModel from '@/models/hentai.model'
import { Arg, Query, Resolver } from 'type-graphql'
import { hentaiType } from '@resolvers/types/hentai.type'

@Resolver()
export class MonthlyRankResolver {
  @Query(() => hentaiType)
  public async monthlyRank(@Arg('rank') rank: number) {
    const data = await hentaiModel.findOne({ monthlyRank: rank })

    return data
  }
}
