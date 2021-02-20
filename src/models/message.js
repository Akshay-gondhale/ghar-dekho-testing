const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  message:{
    type: String,
    required: true,
    trim: true,
  },
  receivedAt:{
    type: String,
    default: new Date(),
  }
});

const message = new mongoose.model("message", messageSchema);

module.exports = message;
