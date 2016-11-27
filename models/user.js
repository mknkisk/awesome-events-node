const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  provider: {
    type: String,
    required: true,
    unique: true
  },
  uid: {
    type: String,
    required: true,
    unique: true
  },
  nickname: {
    type: String,
    required: true
  },
  image_url: {
    type: String,
    required: true
  }
})

// TODO Validates

module.exports = mongoose.model('User', UserSchema)
