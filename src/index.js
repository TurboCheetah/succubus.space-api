import express from 'express'
import morgan from 'morgan'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import router from './routes/index.js'
import { scraper } from './lib/scraper.js'

const app = express()

// Scrape data
scraper()

// Middleware

// Request logging
if (process.argv.includes('--dev') || process.env.NODE_ENV === 'dev') app.use(morgan('dev'))

// GZip compression
app.use(compress())

app.use(cors())

app.use(helmet())

// Routes
app.use('/', router)

app.listen(process.env.PORT || 4445, () => console.log(`Succubus.space running on port ${process.env.PORT || 4445}`))
