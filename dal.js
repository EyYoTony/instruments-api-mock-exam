require('dotenv').config()
const PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-find'))
const db = new PouchDB(process.env.COUCHDB_URL + process.env.COUCHDB_NAME)
const instrumentPKGenerator = require('./lib/build-primary-key')
const { assoc, pathOr, split, head, last } = require('ramda')

//////////////////////
//   Instruments
//////////////////////

const createInstrument = (instrument, callback) => {
  const category = pathOr('', ['category'], instrument)
  const name = pathOr('', ['name'], instrument)
  const pk = instrumentPKGenerator('instument_')(category)(name)
  console.log('pk:', pk)
  instrument = assoc('_id', pk, instrument)
  instrument = assoc('type', 'instrument', instrument)
  createDoc(instrument, callback)
}

const updateInstrument = (instrument, callback) => {
  instrument = assoc('type', 'instrument', instrument)
  createDoc(instrument, callback)
}

const deleteInstrument = (instrumentId, callback) => {
  deleteDoc(instrumentId, callback)
}

const getInstrument = (instrumentId, callback) => {
  db.get(instrumentId, function(err, doc) {
    if (err) return callback(err)
    callback(null, doc)
  })
}

const listInstruments = (limit, lastItem, filter, callback) => {
  var query = {}
  if (filter) {
    const arrFilter = split(':', filter)
    const filterField = head(arrFilter)
    const filterValue = last(arrFilter)
    const selectorValue = assoc(filterField, filterValue, {})
    query = { selector: selectorValue, limit }
  } else if (lastItem) {
    query = { selector: { _id: { $gt: lastItem }, type: 'instrument' }, limit }
  } else {
    query = { selector: { _id: { $gte: null }, type: 'instrument' }, limit }
  }

  find(query, function(err, data) {
    if (err) return callback(err)
    callback(null, data.docs)
  })
}

///////////////////////
//   Helper/Export
//////////////////////

function deleteDoc(id, callback) {
  db
    .get(id)
    .then(function(doc) {
      return db.remove(doc)
    })
    .then(function(result) {
      callback(null, result)
    })
    .catch(function(err) {
      callback(err)
    })
}

function createDoc(doc, callback) {
  console.log('createDoc', doc)
  db.put(doc).then(res => callback(null, res)).catch(err => callback(err))
}

function find(query, cb) {
  console.log('query', JSON.stringify(query, null, 2))
  query ? db.find(query, cb) : cb(null, [])
}

const dal = {
  listInstruments,
  getInstrument,
  createInstrument,
  updateInstrument,
  deleteInstrument
}

module.exports = dal
