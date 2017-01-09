const path = require('path')
const mongoose = require('mongoose')
const Monky = require('monky')
const monky = new Monky(mongoose)

global.__root = path.join(__dirname, '..')

require('./fixtures/user').define(monky)
require('./fixtures/event').define(monky)

module.exports.monky = monky
