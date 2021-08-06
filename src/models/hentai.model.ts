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
    poster_url: {
      type: String
    },
    cover_url: {
      type: String
    },
    brand: {
      type: String
    },
    brand_id: {
      type: String
    },

    duration_in_ms: {
      type: Number
    },

    is_censored: {
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

    monthly_rank: {
      type: Number
    },
    tags: {
      type: [String]
    },
    created_at: {
      type: String
    },

    released_at: {
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
      type: String
    },
    invalid: {
      type: String
    }
  },
  { timestamps: true }
)

const hentaiModel = model<Hentai & Document>('Hentai', hentaiSchema)

export default hentaiModel
