const mongoose = require('mongoose')
const Monky = require('monky')
const monky = new Monky(mongoose)

require('./fixtures/user').define(monky)
require('./fixtures/event').define(monky)

module.exports.monky = monky
