import { model, Schema, Document } from 'mongoose'
import { Hentai } from '@interfaces/hentai.interface'

const hentaiSchema: Schema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String
    },
    titles: {
      type: [String]
    },
    slug: {
      type: String
    },
    description: {
      type: String
    },
    views: {
      type: Number
    },
    interests: {
      type: Number
    },
    posterURL: {
      type: String
    },
    coverURL: {
      type: String
    },
    brand: {
      type: String
    },
    brandID: {
      type: String
    },

    durationInMs: {
      type: Number
    },

    isCensored: {
      type: Boolean
    },
    rating: {
      type: String
    },
    likes: {
      type: Number
    },
    dislikes: {
      type: Number
    },

    monthlyRank: {
      type: Number
    },
    tags: {
      type: [String]
    },
    createdAt: {
      type: String
    },

    releasedAt: {
      type: String
    },
    url: {
      type: String
    },
    streamURL: {
      type: String
    },
    malURL: {
      type: String
    },

    malID: {
      type: Number
    },
    invalid: {
      type: String
    }
  },
  { timestamps: true }
)

const hentaiModel = model<Hentai & Document>('Hentai', hentaiSchema)

export default hentaiModel
