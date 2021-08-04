import '@/config'
import '@utils/scraper'
import App from '@/app'
import IndexRoute from '@routes/index.route'
import HentaiRoute from '@routes/hentai.route'

const app = new App([new IndexRoute(), new HentaiRoute()])

app.listen()
