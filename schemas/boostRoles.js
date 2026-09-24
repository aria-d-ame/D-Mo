const { model, Schema } = require('mongoose');

let boostSchema = new Schema({
    Guild: { type: String },
    User: { type: String },
    RoleID: { type: String },
})

module.exports = model('boost', boostSchema);