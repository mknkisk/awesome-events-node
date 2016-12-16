const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'login demo',
    user: req.user,
    message: req.flash('success')
  })
})

router.get('/logout', function (req, res, next) {
  req.logout()
  res.redirect('/')
})

module.exports = router
