require('dotenv').config()
const express = require('express')
const app = express()
const dal = require('./dal.js')
const HTTPError = require('node-http-error')
const bodyParser = require('body-parser')
const port = process.env.PORT || 4000
const { pathOr } = require('ramda')

app.use(bodyParser.json())

app.get('/', function(req, res, next) {
  res.send(
    'Welcome to the Instruments API.  Try /test and verify dal is working...'
  )
})

//////////////////////
///   instruments  ///
//////////////////////

// CREATE -  POST /instruments
app.post('/instruments', function(req, res, next) {
  const instrument = pathOr(null, ['body'], req)
  dal.createInstrument(instrument, function(err, result) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(201).send(result)
  })
})

// READ   -  GET /instruments/:id
app.get('/instruments/:id', function(req, res, next) {
  const instrumentId = pathOr(null, ['params', 'id'], req)

  dal.getInstrument(instrumentId, function(err, data) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(data)
  })
})

// LIST -    GET /instruments
app.get('/instruments', function(req, res, next) {
  const limit = pathOr(10, ['query', 'limit'], req)

  dal.listInstruments(Number(limit), function(err, data) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(data)
  })
})

// CREATE -  POST /instruments
// READ   -  GET /instruments/:id
// UPDATE -  PUT /instruments/:id
// DELETE -  DELETE /instruments/:id

app.listen(port, () => console.log('API Running on port:', port))
