const monky = require('../setup').monky
const expect = require('chai').expect

describe('Event', () => {
  beforeEach((done) => {
    let suite = this

    monky.build('User', function (err, user) {
      if (err) { console.error(err) }
      suite.user = user

      monky.build('Event', { user: suite.user.id }, function (err, event) {
        if (err) { console.error(err) }
        suite.event = event
        done()
      })
    })
  })

  describe('validating', () => {
    it('should be valid', () => {
      let err = this.event.validateSync()
      expect(err).to.be.a('undefined')
    })

    it('should be invalid when name is empty', () => {
      this.event.name = ''

      let err = this.event.validateSync()
      expect(err.errors.name.kind).to.equal('required')
    })

    it('should be invalid when name is longer than the maximam length (51)', () => {
      this.event.name = 'a'.repeat(51)

      let err = this.event.validateSync()
      expect(err.errors.name.kind).to.equal('maxlength')
    })
  })
})
