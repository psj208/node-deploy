const mongoose = require('mongoose');

const { Schema } = mongoose;
const userSchema = new Schema({
  user : {
    type: String,
    required: true,
    unigue: true
  },
  displayName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  provider: {
    type: String,
    default: 'local',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model('User',userSchema);
