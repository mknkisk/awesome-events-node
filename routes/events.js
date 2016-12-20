const Event = require('../models/event')
const express = require('express')
const router = express.Router()

function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    req.flash('info', 'You must be logged in to see this page.')
    res.redirect('/')
  }
}

router.get('/new', ensureAuthenticated, function (req, res, next) {
  res.render('events/new', { event: new Event() })
})

router.get('/:eventId', function (req, res, next) {
  Event.findById(req.params.eventId, function (err, event) {
    if (err) {
      next(err)
      return
    }

    res.render('events/show', { event: event })
  })
})

router.post('/', ensureAuthenticated, function (req, res, next) {
  let event = new Event({
    name: req.body.name,
    place: req.body.place,
    startTime: new Date(req.body.startTime),
    endTime: new Date(req.body.endTime),
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
