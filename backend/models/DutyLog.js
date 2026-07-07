const mongoose = require("mongoose");

const DutyLogSchema = new mongoose.Schema({
  name: String,
  email: String,
  date: String,

  insideMinutes: {
    type: Number,
    default: 0
  },

  outsideMinutes: {
    type: Number,
    default: 0
  },

  sessions: {
    type: Number,
    default: 1
  },

  lastLogin: Number,
  lastLogout: Number,

  insideTime: String,
  outsideTime: String,
  remaining: String,

  outsideDone: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("DutyLog", DutyLogSchema);