const express = require('express')
const config = require('./config.json')
const fakedb = require('./fakedb.json')

const app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render(`${__dirname}/views/index.ejs`)
})

app.get('/:hentaiID', (req, res) => {
    let id = req.params.hentaiID;
    if (fakedb.hentai[id]) {
        res.render(`${__dirname}/views/hentai.ejs`, {hentai: fakedb.hentai[id]})
        console.log(`Hentai "${fakedb.hentai[id].id}" accessed`) 
    } else {
        res.sendStatus(404)
    }
})

app.get('/api/:hentaiID', (req, res) => {
    let id = req.params.hentaiID;
    if (fakedb.hentai[id]) {
        res.send(fakedb.hentai[id])
        console.log(`Hentai "${fakedb.hentai[id].id}" accessed`) 
    } else {
        res.sendStatus(404)
    }
})

app.listen(process.env.PORT || config.port, () => {
    console.log(`HentaiList running on port ${config.port}`);
})