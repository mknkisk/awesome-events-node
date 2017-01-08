const expect = require('chai').expect

const Event = require('../../models/event')
const User = require('../../models/user')

describe('Event', () => {
  let user
  let event

  beforeEach((done) => {
    user = new User({
      provider: 'twitter',
      uid: '99999999',
      nickname: 'mknkisk',
      image_url: 'https://pbs.twimg.com/profile_images/668754624145285121/J7apaFHF_normal.jpg'
    })

    event = new Event({
      name: 'Sample Event',
      place: 'Toukyoubiggusaito, 3-11-1, Ariake, Koto-ku, Tokyo, 135-0063, Japan',
      startTime: new Date(),
      endTime: new Date(),
      content: 'Sample Content',
      user: user.id
    })

    done()
  })

  describe('validating', () => {
    it('should be valid', () => {
      let err = event.validateSync()
      expect(err).to.be.a('undefined')
    })

    it('should be invalid when name is empty', () => {
      event.name = ''

      let err = event.validateSync()
      expect(err.errors.name.kind).to.equal('required')
    })

    it('should be invalid when name is longer than the maximam length (51)', () => {
      event.name = 'a'.repeat(51)

      let err = event.validateSync()
      expect(err.errors.name.kind).to.equal('maxlength')
    })
  })
})
