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

module.exports = router
