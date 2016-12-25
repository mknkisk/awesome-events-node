const Event = require('../models/event')
const express = require('express')
const router = express.Router()

router.use(function (req, res, next) {
  res.locals.currentUser = req.user
  res.locals.errors = req.flash('error')
  res.locals.infos = req.flash('info')
  next()
})

router.get('/', function (req, res, next) {
  Event.find()
    .gt('startTime', Date.now())
    .sort({ startTime: 'asc' })
    .exec(function (err, events) {
      if (err) {
        next(err)
        return
      }

      res.render('index', { events: events })
    })
})

router.get('/logout', function (req, res, next) {
  req.logout()
  res.redirect('/')
})

module.exports = router
