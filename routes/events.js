const Event = require('../models/event')
const Ticket = require('../models/ticket')
const NotFoundError = require('./error/notFound')
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

router.get('/new', ensureAuthenticated, function (req, res, next) {
  res.render('events/new', { event: new Event() })
})

router.get('/:eventId', function (req, res, next) {
  Event.findById(req.params.eventId).populate('user').exec()
    .then(
      (event) => {
        if (event === null) { throw new NotFoundError('Event not found') }

        let promises = [
          new Promise((resolve, reject) => { resolve(event) }),
          Ticket.find({ event: event.id }).populate('user').sort({ createdAt: 'asc' }).exec()
        ]

        if (req.user) {
          promises.push(
            Ticket.findOne({ event: event.id, user: req.user.id }).exec()
          )
        }

        return Promise.all(promises)
      }
    )
    .then(
      ([event, tickets, userTicket]) => {
        res.render('events/show', { event: event, owner: event.user, tickets: tickets, userTicket: userTicket })
      }
    )
    .catch(
      (error) => {
        console.error(error)
        next(error)
      }
    )
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

router.get('/:eventId/edit', ensureAuthenticated, function (req, res, next) {
  Event.findById(req.params.eventId).where({ user: req.user })
    .exec(function (err, event) {
      if (err) {
        next(err)
        return
      }

      if (event === null) {
        return res.status(404).render('404')
      }

      res.render('events/edit', { event: event })
    })
})

router.put('/:eventId', ensureAuthenticated, function (req, res, next) {
  Event.findById(req.params.eventId).where({ user: req.user })
    .exec(function (err, event) {
      if (err) {
        next(err)
        return
      }

      if (event === null) {
        return res.status(404).render('404')
      }

      event.name = req.body.name
      event.place = req.body.place
      event.startTime = moment.tz(req.body.startTime, 'Asia/Tokyo').toDate()
      event.endTime = moment.tz(req.body.endTime, 'Asia/Tokyo').toDate()
      event.content = req.body.content

      event.save(function (updateErr) {
        if (updateErr) {
          res.render(`events/edit`, { event: event, error: updateErr })
        } else {
          req.flash('info', 'Event Updated!')
          res.redirect(`/events/${event.id}`)
        }
      })
    })
})

router.delete('/:eventId', ensureAuthenticated, function (req, res, next) {
  Event.findByIdAndRemove(req.params.eventId)
    .exec(function (err, event) {
      if (err) {
        console.error(err)
        next(err)
        return
      }

      req.flash('info', 'Event Deleted!')
      res.redirect('/')
    })
})

module.exports = router
