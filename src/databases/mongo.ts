import { mongo } from '@/config'

export const dbConnection = {
  url:
    !!mongo.user && !!mongo.password
      ? `mongodb+srv://${mongo.user}:${mongo.password}@${mongo.host}/${mongo.database}`
      : `mongodb://${mongo.host}:${mongo.port}/${mongo.database}`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }
}
