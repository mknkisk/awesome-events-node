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
  res.render('events/new')
})

module.exports = router
