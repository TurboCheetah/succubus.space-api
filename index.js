const express = require('express')
const config = require('./config.json')
const fakedb = require('./fakedb.json')
const hanime = require('./sites/hanimetv')
const mal = require('./sites/mal')
const { combine } = require('./utils')

const app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render(`${__dirname}/views/index.ejs`)
})

//Sends back a nice parsed page
app.get('/:hentaiID', (req, res) => {
    let id = req.params.hentaiID;
    if (fakedb.hentai[id]) {
        res.render(`${__dirname}/views/hentai.ejs`, {hentai: fakedb.hentai[id]})
    } else {
        res.sendStatus(404)
    }
})

//Sends back raw JSON
app.get('/api/:hentaiID', (req, res) => {
    let id = req.params.hentaiID;
    if (fakedb.hentai[id]) {
        res.send(fakedb.hentai[id])
    } else {
        res.sendStatus(404)
    }
})

//Sends back raw JSON response from HAnime.tv API
app.get('/api/hanime/:query', async (req, res) => {
    let query = req.params.query;
    const search = await hanime.scrape(query);
    if (search == 'No results') {
        res.sendStatus(404)
    } else {
        res.send(search)
    }
})

//Sends back a nice parsed page
app.get('/hanime/:query', async (req, res) => {
    let query = req.params.query;
    const search = await hanime.scrape(query);
    res.render(`${__dirname}/views/hanime.ejs`, {hanime: search})
})

//Sends back raw JSON response from MAL API
app.get('/api/mal/:query', async (req, res) => {
    let query = req.params.query;
    const search = await mal.scrape(query);
    if (search == 'No results') {
        res.sendStatus(404)
    } else {
        res.send(search)
    }
})

//Sends back a nice parsed page
app.get('/mal/:query', async (req, res) => {
    let query = req.params.query;
    const search = await mal.scrape(query);
    res.render(`${__dirname}/views/mal.ejs`, {mal: search})
})

//API with all the data that will later be saved to databse
app.get('/api/hentai/:query', async (req, res) => {
    let query = req.params.query;
    const search = await combine(query);
    if (search == 'No results') {
        res.sendStatus(404)
    } else {
        res.send(search)
    }
})

app.listen(process.env.PORT || config.port, () => {
    console.log(`HentaiList running on port ${config.port}`);
})
