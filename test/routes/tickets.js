const app = require('../../app')
const supertest = require('supertest')
const mongoose  = require('mongoose')
const async     = require('async')
const passportStub = require('passport-stub')

const path = require('path')
const Ticket = require(path.join(global.__root, 'models/ticket'))

// setting
before((done) => {
  passportStub.install(app)
  done()
})

describe('GET /events/:eventId/tickets/new', () => {
  let eventId = mongoose.Types.ObjectId()
  let url = `/events/${eventId}/tickets`

  it('return 404 Not Found', function (done) {
    supertest(app)
      .get(url)
      .expect(404)
      .end(done)
  })
})

describe('POST /events/:eventId/tickets', () => {
  let url

  beforeEach((done) => {
    let suite = this

    async.series([
      (next) => {
        monky.create('User', (err, user) => {
          if (err) { throw err }
          suite.user = user
          next(err)
        })
      },
      (next) => {
        monky.create('Event', { user: suite.user.id }, function (err, event) {
          if (err) { throw err }
          suite.event = event
          next(err)
        })
      }
    ], (err, results) => {
      if (err) { throw err }
      url = `/events/${suite.event.id}/tickets`
      done()
    })
  })

  afterEach((done) => {
    dbCleaner.clean(mongoose.connection.db, () => {
      done()
    })
  })

  context('when logged in', () => {
    beforeEach((done) => {
      passportStub.login(this.user)
      done()
    })

    it('return 201 Created and Ticket is created', (done) => {
      supertest(app)
        .post(url)
        .expect(201)
        .end((err, res) => {
          if (err) { throw err }

          Ticket.count({}, (err, count) => {
            if (err) { throw err }
            expect(count).to.equal(1)
            done()
          })
        })
    })
  })

  context('when logout', function () {
    beforeEach((done) => {
      passportStub.logout()
      done()
    })

    it('return 302 Found', (done) => {
      supertest(app)
        .post(url)
        .expect(302)
        .expect('Location', '/')
        .end(done)
    })
  })
})
