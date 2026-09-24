const { model, Schema } = require('mongoose');

let moneySchema = new Schema({
  Guild: String,
  User: String,
  Money: Number,
  LastMoneyTime: Number,
  LastDailyTime: Number,
})

module.exports = model('money', moneySchema);