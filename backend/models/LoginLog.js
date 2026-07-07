const mongoose = require("mongoose");

const LoginLogSchema = new mongoose.Schema({
  email: String,
  type: String,
  time: {
    type: Date,
    default: Date.now
  },
  duration: {
    type: String,
    default: "-"
  }
});

module.exports = mongoose.model("LoginLog", LoginLogSchema);