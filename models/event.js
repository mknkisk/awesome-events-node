const mongoose = require('mongoose')
const Schema = mongoose.Schema

const EventSchema = new Schema({
  name: {
    type: String,
    maxlength: 50,
    required: true
  },
  place: {
    type: String,
    maxlength: 100,
    required: true
  },
  startTime: {
    type: Date,
    default: Date.now,
    required: true
  },
  endTime: {
    type: Date,
    default: Date.now,
    required: true
  },
  content: {
    type: String,
    maxlength: 2000,
    required: true
  },
  user: { type: Schema.ObjectId, ref: 'User' }
})

const startTimeShouldBeBeforeEndTime = function (value) {
  if (!value || !this.endTime) { return true }
  return value <= this.endTime
}

EventSchema.path('startTime').validate(startTimeShouldBeBeforeEndTime, 'start time always lesser than end time.')

EventSchema.methods.createdBy = function (user) {
  if (user === undefined) {
    return false
  }
  return this.user.id === user.id
}

module.exports = mongoose.model('Event', EventSchema)
