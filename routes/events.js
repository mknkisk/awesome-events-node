const Event = require('../models/event')
const express = require('express')
const router = express.Router()
const moment = require('moment-timezone')

function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    req.flash('info', 'You must be logged in to see this page.')
    res.redirect('/')
  }
}

router.get('/', function (req, res, next) {
  Event.find()
    .gt('startTime', Date.now())
    .sort({ startTime: 'asc' })
    .exec(function (err, events) {
      if (err) {
        next(err)
        return
      }

      res.render('events/index', { events: events })
    })
})

router.get('/new', ensureAuthenticated, function (req, res, next) {
  res.render('events/new', { event: new Event() })
})

router.get('/:eventId', function (req, res, next) {
  Event.findById(req.params.eventId)
    .populate('user')
    .exec(function (err, event) {
      if (err) {
        next(err)
        return
      }

      if (event === null) {
        return res.status(404).render('404')
      }

      res.render('events/show', { event: event, owner: event.user })
    })
})

router.post('/', ensureAuthenticated, function (req, res, next) {
  let event = new Event({
    name: req.body.name,
    place: req.body.place,
    startTime: moment.tz(req.body.startTime, 'Asia/Tokyo').toDate(),
    endTime: moment.tz(req.body.endTime, 'Asia/Tokyo').toDate(),
    content: req.body.content,
    user: req.user.id
  })

  event.save(function (err, _event) {
    if (err) {
      res.render('events/new', { event: event, error: err })
      return
    }

    req.flash('info', 'Event Created!')
    res.redirect(`/events/${_event.id}`)
  })
})

module.exports = router
