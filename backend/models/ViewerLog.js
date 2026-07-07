const mongoose = require("mongoose");

const ViewerLogSchema = new mongoose.Schema({
  email:String,
  action:String,
  time:String
});

module.exports =
mongoose.model("ViewerLog", ViewerLogSchema);