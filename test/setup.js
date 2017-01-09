const mongoose = require('mongoose')
const Monky = require('monky')
const monky = new Monky(mongoose)

require('../models/user')
require('../models/event')

monky.factory('User',
  {
    provider: 'twitter',
    uid: '99999999',
    nickname: 'mknkisk',
    image_url: 'https://pbs.twimg.com/profile_images/668754624145285121/J7apaFHF_normal.jpg'
  }
)

monky.factory('Event',
  {
    name: 'Sample Event',
    place: 'Toukyoubiggusaito, 3-11-1, Ariake, Koto-ku, Tokyo, 135-0063, Japan',
    startTime: new Date(),
    endTime: new Date(),
    content: 'Sample Content'
  }
)

module.exports.monky = monky
