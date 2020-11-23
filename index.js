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

// READ
// const fs = require("fs");
// const fastcsv = require("fast-csv");

// let stream = fs.createReadStream("ceps.txt");
// let csvStream = fastcsv.parse({ delimiter: '\t' })
//     .on("data", function (data) {
//         let zipecode = data[0]
//         let city = data[1].split('/')[0]
//         let stateacronym = data[1].split('/')[1]
//         let neighborhood = data[2]
//         let street = data[3].split(', ')[0].split('-')[0]
//         let streetnumber = 0
//         if (data[3].split(', ').length > 1) {
//             streetnumber = data[3].split(', ')[1].split(' ')[0]
//         }
//         let complement = data[4] || ''

//         let query = 'INSERT INTO CEPS(zipcode, city, stateacronym, neighborhood, street, streetnumber, complement) VALUES('
//         query += zipecode
//         query += ', '
//         query += '\'' + city + '\''
//         query += ', '
//         query += '\'' + stateacronym + '\''
//         query += ', '
//         query += '\'' + neighborhood + '\''
//         query += ', '
//         query += '\'' + street + '\''
//         query += ', '
//         query += streetnumber
//         query += ', '
//         query += '\'' + complement + '\''
//         query += ')'
//         pool.query(query, (error, results) => {
//             if (error) {
//                 console.log(error)
//                 // throw error
//             }
//         })
//     })
//     .on("end", function () {
//         stream.close()
//     });

// stream.pipe(csvStream);

const app = express()
const port = 3000

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/anuncio/:lat/:lon', (req, res) => {
    pool.query("SELECT an.*, ST_Distance(ST_GeographyFromText('POINT(" + req.params.lat + " " + req.params.lon + ")'), an.location)/1000 as dist FROM anuncios an WHERE an.location is not null ORDER BY dist asc limit 50", (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
})

app.get('/anuncio2/:lat/:lon/:size', (req, res) => {
    pool.query("SELECT an.*, ST_Distance(ST_GeographyFromText('POINT(" + req.params.lat + " " + req.params.lon + ")'), an.location)/1000 as dist FROM anuncios an WHERE an.location is not null ORDER BY dist asc limit " + req.params.lon, (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
})

app.get('/imoveis', (req, res) => {
    pool.query("SELECT * FROM imoveis order by id_imoveis desc", (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
})

app.post('/imoveis', (req, res) => {
    let query = "INSERT INTO IMOVEIS (nome, divida, city, state, street, latitude, longitude, businesstype, declared_price, price, usableareas, bedrooms, bathrooms, suites, parkingspaces, rate, createdat, final_date, price_m2) VALUES ("
    query += '\'' + req.body.nome + '\''
    query += ", "
    query += '\'' + req.body.divida + '\''
    query += ", "
    query += '\'' + req.body.city + '\''
    query += ", "
    query += '\'' + req.body.state + '\''
    query += ", "
    query += '\'' + req.body.street + '\''
    query += ", "
    query += req.body.latitude
    query += ", "
    query += req.body.longitude
    query += ", "
    query += '\'' + req.body.businesstype + '\''
    query += ", "
    query += req.body.declared_price
    query += ", "
    query += req.body.price
    query += ", "
    query += req.body.usableareas
    query += ", "
    query += req.body.bedrooms
    query += ", "
    query += req.body.bathrooms
    query += ", "
    query += req.body.suites
    query += ", "
    query += req.body.parkingspaces
    query += ", "
    query += req.body.rate
    query += ", "
    query += '\'' + req.body.createdat + '\''
    query += ", "
    query += '\'' + req.body.final_date + '\''
    query += ", "
    query += req.body.price_m2
    query += ")"
    console.log(query)
    pool.query(query, (error, results) => {

        if (error) {
            throw error
        }
        data = { result: 'OK' }
        res.status(200).json(data)
    })
})

app.put('/imoveis', (req, res) => {
    const id = req.body.id_imoveis;
    const price = req.body.price;
    const price_m2 = req.body.price_m2;
    pool.query("UPDATE IMOVEIS SET price = " + price + ", price_m2 = " + price_m2 + " WHERE id_imoveis = " + id, (error, results) => {
        if (error) {
            throw error
        }
        data = { result: 'OK' }
        res.status(200).json(data)
    })
})

app.listen(port, () => {
    console.log(`Executando na porta ${port}`)
})