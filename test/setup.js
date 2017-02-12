process.env.NODE_ENV = 'test'

const path = require('path')
const mongoose = require('mongoose')
const Monky = require('monky')
const monky = new Monky(mongoose)
const expect = require('chai').expect
const Cleaner = require('database-cleaner')
const dbCleaner = new Cleaner('mongodb')

global.__root = path.join(__dirname, '..')
global.monky = monky
global.expect = expect
global.dbCleaner = dbCleaner

require('./fixtures/user').define(monky)
require('./fixtures/event').define(monky)
