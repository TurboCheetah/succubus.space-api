import { model, Schema, Document } from 'mongoose'
import { Hentai } from '@interfaces/hentai.interface'

const franchiseSchema: Schema = new Schema({
  id: Number,
  name: String,
  slug: String
})

const franchiseVideoSchema: Schema = new Schema({
  id: Number,
  name: String,
  slug: String
})

const hentaiSchema: Schema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true
    },

    name: String,

    titles: [String],

    slug: String,

    description: String,

    views: Number,

    interests: Number,

    posterURL: String,

    coverURL: String,

    brand: String,

    brandID: String,

    durationInMs: Number,

    isCensored: Boolean,

    rating: String,

    likes: Number,

    dislikes: Number,

    monthlyRank: Number,

    tags: [String],

    franchise: franchiseSchema,

    franchiseVideos: [franchiseVideoSchema],

    createdAt: String,

    releasedAt: String,
    url: String,
    streamURL: String,

    malURL: String,

    malID: Number,

    invalid: Boolean
  },
  { timestamps: true }
)

const hentaiModel = model<Hentai & Document>('Hentai', hentaiSchema)

export default hentaiModel
