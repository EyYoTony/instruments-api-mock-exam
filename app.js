require('dotenv').config()
const express = require('express')
const app = express()
const dal = require('./dal.js')
const HTTPError = require('node-http-error')
const bodyParser = require('body-parser')
const port = process.env.PORT || 5000
const { pathOr, keys } = require('ramda')

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
  const body = pathOr(null, ['body'], req)
  dal.createInstrument(body, function(err, result) {
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

// UPDATE -  PUT /instruments/:id
app.put('/instruments/:id', function(req, res, next) {
  const instrumentId = pathOr(null, ['params', 'id'], req)
  const body = pathOr(null, ['body'], req)
  if (!body || keys(body).length === 0)
    return next(new HTTPError(400, 'Missing data in request body.'))

  dal.updateInstrument(body, function(err, result) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(result)
  })
})

// DELETE -  DELETE /instruments/:id
app.delete('/instruments/:id', function(req, res, next) {
  const instrumentId = pathOr(null, ['params', 'id'], req)

  dal.deleteInstrument(instrumentId, function(err, response) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(response)
  })
})

// LIST -   GET /instruments
app.get('/instruments', function(req, res, next) {
  const limit = pathOr(10, ['query', 'limit'], req)
  const lastItem = pathOr(null, ['query', 'lastItem'], req)
  dal.listInstruments(Number(limit), lastItem, function(err, data) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(data)
  })
})

// DELETE -  DELETE /instruments/:id

app.listen(port, () => console.log('API Running on port:', port))
