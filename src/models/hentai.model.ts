import { model, Schema, Document } from 'mongoose'
import { Hentai } from '#interfaces/hentai/Hentai.interface'

const hentaiTitleSchema: Schema = new Schema({
  lang: String,
  kind: String,
  title: String
})

const hentaiBrandSchema: Schema = new Schema({
  id: Number,
  title: String,
  slug: String,
  websiteURL: String,
  logoURL: String,
  email: String,
  count: Number
})

const hentaiTagSchema: Schema = new Schema({
  id: Number,
  text: String
})

const hentaiFranchiseSchema: Schema = new Schema({
  id: Number,
  name: String,
  slug: String,
  title: String
})

const hentaiFranchiseVideoInfoSchema: Schema = new Schema({
  id: Number,
  name: String,
  slug: String,
  createdAt: String,
  releasedAt: String,
  views: Number,
  interests: Number,
  posterURL: String,
  coverURL: String,
  isHardSubtitled: Boolean,
  brand: String,
  durationInMs: Number,
  isCensored: Boolean,
  rating: Number,
  likes: Number,
  dislikes: Number,
  downloads: Number,
  monthlyRank: Number,
  brandID: String,
  isBannedIn: String,
  previewURL: String,
  primaryColor: String,
  createdAtUnix: Number,
  releasedAtUnix: Number
})

const streamSchema: Schema = new Schema({
  _360p: String,
  _480p: String,
  _720p: String,
  _1080p: String
})

const hentaiSchema: Schema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true
    },

    name: String,

    titles: [hentaiTitleSchema],

    slug: String,

    description: String,

    views: Number,

    interests: Number,

    posterURL: String,

    coverURL: String,

    brand: hentaiBrandSchema,

    durationInMs: Number,

    isCensored: Boolean,

    rating: String,

    likes: Number,

    dislikes: Number,

    monthlyRank: Number,

    bannedIn: String,

    hardSubtitled: Boolean,

    tags: [hentaiTagSchema],

    franchise: hentaiFranchiseSchema,

    franchiseVideos: [hentaiFranchiseVideoInfoSchema],

    releasedAt: String,

    url: String,

    streams: streamSchema,

    malID: Number,

    malDescription: String
  },
  { timestamps: true }
)

const hentaiModel = model<Hentai & Document>('Hentai', hentaiSchema)

export default hentaiModel
