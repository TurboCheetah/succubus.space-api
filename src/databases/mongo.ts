import { mongo } from '@/config'
import { ConnectOptions } from 'mongoose'

export const dbConnection = {
  url:
    !!mongo.user && !!mongo.password
      ? `mongodb+srv://${mongo.user}:${mongo.password}@${mongo.host}/${mongo.database}`
      : `mongodb://${mongo.host}:${mongo.port}/${mongo.database}`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  } as ConnectOptions
}
