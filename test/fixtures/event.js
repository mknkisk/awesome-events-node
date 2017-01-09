let define = (monky) => {
  require(require('path').join(global.__root, 'models/event'))

  monky.factory('Event',
    {
      name: 'Sample Event',
      place: 'Toukyoubiggusaito, 3-11-1, Ariake, Koto-ku, Tokyo, 135-0063, Japan',
      startTime: new Date(),
      endTime: new Date(),
      content: 'Sample Content'
    }
  )
}

module.exports = { define: define }
