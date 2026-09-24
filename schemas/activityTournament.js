const { model, Schema } = require('mongoose');

let pointSchema = new Schema({
    Guild: { type: String, required: true },
    User: { type: String, required: true },
    Points: { type: Number, default: 0 },
    LastPointTime: { type: Date, default: Date.now }
})

module.exports = model('points', pointSchema);