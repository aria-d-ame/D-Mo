const { model, Schema } = require('mongoose');

let bumpSchema = new Schema({
  guildId: String,
  channelId: String,
  lastBumpTime: Date,

})

module.exports = model('bump', bumpSchema);