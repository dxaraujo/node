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
    let query = "INSERT INTO IMOVEIS VALUE(nome, divida, city, state, street, latitude, longitude, businesstype, declared_price, price, totalareas, bedrooms, bathrooms, parkingspaces, rate, createdat, final_date, price_m2) VALUES ("
    query += req.body.nome
    query += ", "
    query += req.body.divida
    query += ", "
    query += req.body.city
    query += ", "
    query += req.body.state
    query += ", "
    query += req.body.street
    query += ", "
    query += req.body.latitude
    query += ", "
    query += req.body.longitude
    query += ", "
    query += req.body.businesstype
    query += ", "
    query += req.body.declared_price
    query += ", "
    query += req.body.price
    query += ", "
    query += req.body.totalareas
    query += ", "
    query += req.body.bedrooms
    query += ", "
    query += req.body.bathrooms
    query += ", "
    query += req.body.parkingspaces
    query += ", "
    query += req.body.rate
    query += ", "
    query += req.body.createdat
    query += ", "
    query += req.body.final_date
    query += ", "
    query += req.body.price_m2
    query += ")"
    pool.query(query, (error, results) => {
        
        if (error) {
            throw error
        }
        res.status(200).json("{\"result\": \"OK\"}")
    })
})

app.put('/imoveis', (req, res) => {
    const id = req.body.id_imoveis;
    const price = req.body.price;
    const price_m2 = req.body.price_m2;
    pool.query("UPDATE IMOVEIS SET id_imoveis = " + id + ", price = " + price + ", price_m2 = " + price_m2, (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json("{\"result\": \"OK\"}")
    })
})

app.listen(port, () => {
    console.log(`Executando na porta ${port}`)
})