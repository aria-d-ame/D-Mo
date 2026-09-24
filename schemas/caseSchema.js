const { model, Schema } = require('mongoose');

let caseSchema = new Schema({
  Guild: String,
  User: String,
  Type: String,
  Warn: Number,
  _id: String,
  Reason: String,
  Moderator: String,
  Time: Number,
})

module.exports = model('case', caseSchema);