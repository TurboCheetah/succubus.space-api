import { model, Schema, Document } from 'mongoose'
import { Doujin } from 'nhentai'

const doujinImageSchema: Schema = new Schema({
  extension: { type: String },
  height: { type: Number },
  width: { type: Number },
  url: { type: String },
  pageNumber: { type: Number }
})

const doujinTagSchema: Schema = new Schema({
  id: { type: Number },
  type: { type: String },
  name: { type: String },
  url: { type: String },
  count: { type: Number }
})

const doujinTagManagerSchema: Schema = new Schema({
  all: { type: [doujinTagSchema] }
})

const doujinSchema: Schema = new Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true
    },

    mediaId: {
      type: Number
    },

    titles: {
      english: { type: String },
      japanese: { type: String },
      pretty: { type: String }
    },

    pages: {
      type: [doujinImageSchema]
    },

    cover: {
      type: doujinImageSchema
    },

    thumbnail: {
      type: doujinImageSchema
    },

    url: {
      type: String
    },

    scanlator: {
      type: String
    },

    uploadDate: {
      type: Date
    },

    uploadTimestamp: {
      type: Number
    },

    length: {
      type: Number
    },

    favorites: {
      type: Number
    },

    tags: {
      type: doujinTagManagerSchema
    }
  },
  { timestamps: true }
)

const doujinModel = model<Doujin & Document>('Doujin', doujinSchema)

export default doujinModel
