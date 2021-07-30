import cron from 'node-cron'
import { Utils } from './Utils.js'

export const scraper = () => {
  // Scrape new data every hour
  cron.schedule('0 * * * *', () => Utils.scrape())
}
