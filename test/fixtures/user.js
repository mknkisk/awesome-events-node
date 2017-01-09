require('../../models/user')

let define = (monky) => {
  monky.factory('User',
    {
      provider: 'twitter',
      uid: '99999999',
      nickname: 'mknkisk',
      image_url: 'https://pbs.twimg.com/profile_images/668754624145285121/J7apaFHF_normal.jpg'
    }
  )
}

module.exports = { define: define }
