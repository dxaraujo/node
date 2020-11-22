const express = require('express')
const bodyParser = require('body-parser');
const Pool = require('pg').Pool
const pool = new Pool({
    user: 'whiletrue',
    host: '139.64.244.144',
    database: 'whiletrue',
    password: 'whiletrue',
    port: 5432,
})

const app = express()
const port = 3000

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/latlon/:lat/:lon', (req, res) => {
    pool.query("SELECT an.*, ST_Distance(ST_GeographyFromText('POINT(" + req.params.lat + " " + req.params.lon + ")'), an.location)/1000 as dist FROM anuncios an WHERE an.location is not null ORDER BY dist asc limit 50", (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
})

app.get('/id/:id', (req, res) => {
    pool.query("SELECT * FROM anuncios WHERE id_anuncios =" + req.params.id, (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
})

app.get('/imoveis', (req, res) => {
    pool.query("SELECT * FROM imoveis", (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
})

app.post('/imoveis', (req, res) => {
    const id = req.body.id_imoveis;
    const price = req.body.price;
    const price_m2 = req.body.price_m2;
    pool.query("UPDADE IMOVEIS SET id_imoveis = " + id + ", price = " + price + ", price_m2 = " + price_m2, (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
})

app.listen(port, () => {
    console.log(`Executando na porta ${port}`)
})