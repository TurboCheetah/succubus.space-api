import 'reflect-metadata'
import '@/config'
import '@utils/scraper'
import App from '@/app'
import IndexRoute from '@routes/index.route'
import HentaiRoute from '@routes/hentai.route'
import DoujinRoute from '@routes/doujin.route'
import { container } from 'tsyringe'

const app = new App([container.resolve(IndexRoute), container.resolve(HentaiRoute), container.resolve(DoujinRoute)])

app.listen()
