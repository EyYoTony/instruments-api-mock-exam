const { join, trim, toLower, replace, compose, append } = require('ramda')

// returns 'instrument_cello_cello_platinum'
// prefix: "instrument_"  value:  "Cello Platinum"  =>  'instrument_cello_cello_platinum'

module.exports = prefix => category => name =>
  compose(
    trim,
    toLower,
    replace(/ /g, '_'),
    join(' '),
    append(name),
    append(category),
    append(prefix)
  )([])
