const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'login demo',
    session: req.session.passport,
    message: req.flash('success')
  })
})

router.get('/logout', function (req, res, next) {
  req.logout()
  req.session.destroy()
  res.redirect('/')
})

module.exports = router
