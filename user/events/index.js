const utils = require('utils')
const events = require('./events')

module.exports = utils.string.prefixObject(events, 'users');