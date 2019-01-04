const mongoose = require('mongoose');

const { Schema } = mongoose;

const roomSchema = new Schema({
  title : {
    type: String,
    required: true
  },
  max: {
    type: Number,
    requred: true,
    default: 20,
    min: 2
  },
  owner: {
    type: String,
    required: true
  },
  password: String,
  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model('Room',roomSchema);
