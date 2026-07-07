const mongoose = require("mongoose");

const AttendanceLogSchema = new mongoose.Schema({
  name: String,
  email: String,
  type: String,
  date: String,
  in: String,
  out: {
    type: String,
    default: "-"
  },
  duration: {
    type: String,
    default: "Active"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("AttendanceLog", AttendanceLogSchema);