const express = require('express')
const router = express.Router()

router.use(function (req, res, next) {
  res.locals.currentUser = req.user
  res.locals.errors = req.flash('error')
  res.locals.infos = req.flash('info')
  next()
})

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'login demo'
  })
})

router.get('/logout', function (req, res, next) {
  req.logout()
  res.redirect('/')
})

module.exports = router
