import { mongo } from '@/config'

export const dbConnection = {
  url: `mongodb://${mongo.host}:${mongo.port}/${mongo.database}`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }
}
