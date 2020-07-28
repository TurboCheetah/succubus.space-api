const express = require('express')
const config = require('./config.json')

const app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render(`${__dirname}/views/index.ejs`)
})

app.listen(process.env.PORT || config.port, () => {
    console.log(`HentaiList running on port ${config.port}`);
})