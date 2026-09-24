const { model, Schema } = require('mongoose');

let stickySchema = new Schema({
  Guild: String,
  Channel: String,
  MessageId: String,
})

module.exports = model('sticky', stickySchema);