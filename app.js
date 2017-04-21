const express = require('express')
const path = require('path')
// const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

const mongoose = require('mongoose')
const config = require('config')
require('dotenv').config()

const moment = require('moment')

// Routes
const index = require('./routes/index')
const oauth = require('./routes/oauth')
const users = require('./routes/users')
const events = require('./routes/events')
const tickets = require('./routes/tickets')

const User = require('./models/user')
const passport = require('passport')
const TwitterStrategy = require('passport-twitter').Strategy

// Error
const NotFoundError = require('./routes/error/notFound')

const app = express()

// globals
global.__root = __dirname

// view helpers
app.locals._ = require('lodash')
app.locals.moment = moment
app.locals.datetimeFormat = (val) => { return moment(val).format('YYYY-MM-DDTHH:mm') }

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))
app.use(cookieParser())
app.use(flash())
app.use('/static', express.static(path.join(__dirname, 'public')))

// connect mongodb
mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.dbName}`)
mongoose.Promise = global.Promise
// mongoose.set('debug', true)

// session
app.use(session({
  secret: 'keyboard cat',
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  resave: false,
  saveUninitialized: false
}))

// passport setup
passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (err) { return done(err) }
    done(err, user)
  })
})

passport.use(new TwitterStrategy(
  {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: 'http://127.0.0.1:3000/oauth/callback/'
  },
  function (token, tokenSecret, profile, done) {
    console.log(token, tokenSecret, profile)

    process.nextTick(function () {
      let uid = profile.id

      User.findOneAndUpdate({
        uid: uid,
        provider: profile.provider
      }, {
        $set: {
          uid: uid,
          nickname: profile.username,
          image_url: profile.photos[0].value
        }
      }, {
        upsert: true
      }, function (err, user) {
        console.log('findOneAndUpdate err:', err, 'user:', user)
        return done(null, user)
      })
    })
  }
))

app.use(passport.initialize())
app.use(passport.session())

app.use('/', index)
app.use('/oauth', oauth)
app.use('/users', users)
events.use('/:eventId/tickets', tickets)
app.use('/events', events)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(new NotFoundError('Routing Not Found'))
})

app.use(function (err, req, res, next) {
  if (err instanceof NotFoundError) {
    res.status(404).render('404')
  } else {
    next(err)
  }
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  console.error(err)

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
