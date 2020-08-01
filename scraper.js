const { combine } = require('./utils')

setTimeout(() => {
  for (let i = 5; i < 2632; i++) {
    combine(i)
    console.log(`Scraping data for ID ${i}`)
  }
}, 3600000)
