const { model, Schema } = require('mongoose');

let crimeSchema = new Schema({
  Guild: String,
  User: String,
  Crime: Number,
})

module.exports = model('crime', crimeSchema);