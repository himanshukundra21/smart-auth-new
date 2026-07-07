const mongoose = require("mongoose");

const ViewerSchema = new mongoose.Schema({
  email:String,
  password:String
});

module.exports =
mongoose.model("Viewer", ViewerSchema);