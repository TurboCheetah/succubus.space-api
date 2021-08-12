import 'reflect-metadata'
import '@/config'
import '@utils/scraper'
import App from '@/app'
import IndexRoute from '@routes/index.route'
import HentaiRoute from '@routes/hentai.route'
import DoujinRoute from '@routes/doujin.route'

const app = new App([new IndexRoute(), new HentaiRoute(), new DoujinRoute()])

app.listen()
