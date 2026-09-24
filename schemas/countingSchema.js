const { model, Schema } = require('mongoose');

let counting = new Schema({
  Guild: String,
  Channel: String,
  Number: Number,
  LastUser: String,
  RoleAssignments: [{ userId: String, assignedAt: Date }] 
})

module.exports = model('counting', counting);