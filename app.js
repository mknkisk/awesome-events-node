const express = require('express')
const path = require('path')
// const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const bodyParser = require('body-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

const mongoose = require('mongoose')
const config = require('config')

const index = require('./routes/index')
const oauth = require('./routes/oauth')
const users = require('./routes/users')

const User = require('./models/user')
const passport = require('passport')
const TwitterStrategy = require('passport-twitter').Strategy

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(flash())
app.use(express.static(path.join(__dirname, 'public')))

// connect mongodb
mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.dbName}`)
mongoose.set('debug', true)

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

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
