const mongoose = require('mongoose');

const config = new mongoose.Schema({
  _id: { type: String, required: true }, // Allow string _id
  tournamentStatus: { type: Boolean, default: false }
})

module.exports = mongoose.model('config', config);