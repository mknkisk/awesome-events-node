const Ticket = require('../models/ticket')
const express = require('express')
const router = express.Router({mergeParams: true})

function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    req.flash('info', 'You must be logged in to see this page.')
    res.redirect('/')
  }
}
router.get('/new', ensureAuthenticated, function (req, res, next) {
  return res.status(404).render('404')
})

router.post('/', ensureAuthenticated, function (req, res, next) {
  let ticket = new Ticket({
    user: req.user.id,
    event: req.params.eventId,
    comment: req.body.comment
  })

  ticket.save(function (err, result) {
    if (err) {
      console.error(err)

      if (err.name === 'ValidationError') {
        return res.status(422).json({ errors: err.errors })
      } else {
        return res.status(500).json({ errors: { message: 'Unknown Error' } })
      }
    }

    req.flash('info', 'Participated in this event!')
    res.send(201)
  })
})

router.delete('/:ticketId', ensureAuthenticated, function (req, res, next) {
  Ticket.findByIdAndRemove(req.params.ticketId)
    .exec(function (err, event) {
      if (err) {
        console.error(err)
        next(err)
        return
      }

      req.flash('info', 'Cancellation has been completed!')
      res.redirect('/')
    })
})

module.exports = router
