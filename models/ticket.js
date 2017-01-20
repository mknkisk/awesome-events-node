const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TicketSchema = new Schema({
  comment: {
    type: String,
    maxlength: 30
  },
  user: { type: Schema.ObjectId, ref: 'User' },
  event: { type: Schema.ObjectId, ref: 'Event' }
})

module.exports = mongoose.model('Ticket', TicketSchema)
