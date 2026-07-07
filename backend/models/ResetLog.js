const mongoose = require("mongoose");

const ResetLogSchema = new mongoose.Schema({
  name:String,
  email:String,
  phone:String,
  method:String,
  time:String
});

module.exports =
mongoose.model("ResetLog", ResetLogSchema);