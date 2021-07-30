import cron from 'node-cron'
import { scrape } from './utils.js'

export const scraper = () => {
  // Scrape new data every hour
  cron.schedule('0 * * * *', () => scrape())
}
