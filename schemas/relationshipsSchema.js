const { model, Schema } = require('mongoose');

let relationshipsSchema = new Schema({
  Guild: String,
  User: String,
  Spouse: String,
  Children: String,
  Parent: String,
})

module.exports = model('relationships', relationshipsSchema);