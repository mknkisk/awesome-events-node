const express = require('express')
const router = express.Router()
const passport = require('passport')

// /oauth
router.get('/', passport.authenticate('twitter'), function (req, res, next) {
  console.log(req, res, next)
})

// /oauth/callback
router.get('/callback',
  passport.authenticate('twitter', {
    successRedirect: '/',
    failureRedirect: '/',
    successFlash: 'Welcome!',
    failureFlash: true
  })
)

module.exports = router
