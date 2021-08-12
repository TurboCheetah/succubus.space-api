import { model, Schema, Document } from 'mongoose'
import { Doujin } from '@interfaces/doujin.interface'

const doujinSchema: Schema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true
    },

    titles: {
      english: { type: String },
      japanese: { type: String },
      pretty: { type: String }
    },

    uploadDate: {
      type: Date
    },

    length: {
      type: Number
    },

    favorites: {
      type: Number
    },

    url: {
      type: String
    },

    cover: {
      type: String
    },

    thumbnail: {
      type: String
    },

    tags: {
      type: [String]
    },

    invalid: {
      type: String
    }
  },
  { timestamps: true }
)

const doujinModel = model<Doujin & Document>('Doujin', doujinSchema)

export default doujinModel
