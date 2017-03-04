const app = require('../../app')
const supertest = require('supertest')
const mongoose  = require('mongoose')
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
  let suite = {}

  beforeEach((done) => {
    monky.create('User').then(
      (user) => {
        suite.user = user
        return monky.create('Event', { user: suite.user.id })
      },
      (err) => { throw err }
    ).then(
      (event) => {
        suite.url = `/events/${event.id}/tickets`
        done()
      },
      (err) => { throw err }
    )
  })

  afterEach((done) => {
    dbCleaner.clean(mongoose.connection.db, () => {
      done()
    })
  })

  context('when logged in', () => {
    beforeEach((done) => {
      passportStub.login(suite.user)
      done()
    })

    it('return 201 Created and Ticket is created', (done) => {
      supertest(app)
        .post(suite.url)
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
        .post(suite.url)
        .expect(302)
        .expect('Location', '/')
        .end(done)
    })
  })
})
