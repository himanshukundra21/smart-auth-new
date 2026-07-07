const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const LoginLog = require("../models/LoginLog");
const AttendanceLog = require("../models/AttendanceLog");
const ResetLog = require("../models/ResetLog");
const Viewer = require("../models/Viewer");
const ViewerLog = require("../models/ViewerLog");
const DutyLog = require("../models/DutyLog");
const axios = require("axios");
const router = express.Router();

// REGISTER API
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, faceDescriptors } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required ❌"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists ❌"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      faceDescriptors
    });

    await user.save();

    res.json({
      success: true,
      message: "User registered successfully ✅",
      user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Register failed ❌",
      error: error.message
    });
  }
});
// LOGIN API
router.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found ❌"
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Wrong password ❌"
      });
    }

    res.json({
      success: true,
      message: "Login successful ✅",
      user
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Login failed ❌",
      error: error.message
    });

  }
});
// GET ALL USERS API
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      users: users
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Users fetch failed ❌",
      error: error.message
    });
  }
});
// SAVE LOGIN LOG API
router.post("/login-log", async (req, res) => {
  try {

    const { email, type, duration } = req.body;

    const log = new LoginLog({
      email,
      type,
      duration
    });

    await log.save();

    res.json({
      success: true,
      message: "Login log saved ✅"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Login log save failed ❌"
    });

  }
});

// GET LOGIN LOGS API
router.get("/login-logs", async (req, res) => {
  try {

    const logs = await LoginLog.find().sort({ time: -1 });

    res.json({
      success: true,
      logs
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Login logs fetch failed ❌"
    });

  }
});
// SAVE ATTENDANCE API
router.post("/attendance-log", async (req, res) => {
  try {
    const { name, email, type, date, inTime, out, duration } = req.body;

    const log = new AttendanceLog({
      name,
      email,
      type,
      date,
      in: inTime,
      out,
      duration
    });

    await log.save();

    res.json({
      success: true,
      message: "Attendance saved ✅",
      log
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Attendance save failed ❌",
      error: error.message
    });
  }
});

// GET ATTENDANCE API
router.get("/attendance-logs", async (req, res) => {
  try {
    const logs = await AttendanceLog.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      logs
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Attendance fetch failed ❌",
      error: error.message
    });
  }
});
router.get("/hello", (req, res) => {
  res.json({
    message: "Hello Attendance Route Working ✅"
  });
});
// SAVE DUTY LOG API
router.post("/duty-log", async (req, res) => {
  try {
    const duty = new DutyLog(req.body);
    await duty.save();

    res.json({
      success: true,
      message: "Duty log saved ✅",
      duty
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Duty log save failed ❌",
      error: error.message
    });
  }
});

// GET DUTY LOGS API
router.get("/duty-logs", async (req, res) => {
  try {
    const logs = await DutyLog.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      logs
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Duty logs fetch failed ❌",
      error: error.message
    });
  }
});
// SAVE RESET LOG
router.post("/reset-log", async (req,res)=>{
  try{

    const log = new ResetLog(req.body);

    await log.save();

    res.json({
      success:true,
      message:"Reset log saved ✅"
    });

  }catch(error){

    res.status(500).json({
      success:false,
      message:"Reset save failed ❌"
    });

  }
});

// GET RESET LOGS
router.get("/reset-logs", async (req,res)=>{
  try{

    const logs =
    await ResetLog.find().sort({_id:-1});

    res.json({
      success:true,
      logs
    });

  }catch(error){

    res.status(500).json({
      success:false,
      message:"Reset fetch failed ❌"
    });

  }
});
// CREATE VIEWER
router.post("/viewer", async (req,res)=>{
  try{

    const { email, password } = req.body;

    const exists =
    await Viewer.findOne({ email });

    if(exists){
      return res.status(400).json({
        success:false,
        message:"Viewer already exists ❌"
      });
    }

    const viewer = new Viewer({
      email,
      password
    });

    await viewer.save();

    res.json({
      success:true,
      message:"Viewer created ✅"
    });

  }catch(error){

    res.status(500).json({
      success:false,
      message:"Viewer create failed ❌"
    });

  }
});

// GET VIEWERS
router.get("/viewers", async (req,res)=>{
  try{

    const viewers =
    await Viewer.find().sort({_id:-1});

    res.json({
      success:true,
      viewers
    });

  }catch(error){

    res.status(500).json({
      success:false,
      message:"Viewer fetch failed ❌"
    });

  }
});
router.get("/viewer-test", (req,res)=>{
  res.json({ message:"viewer route working ✅" });
});
// SAVE VIEWER LOG
router.post("/viewer-log", async (req,res)=>{
  try{
    const log = new ViewerLog(req.body);
    await log.save();

    res.json({
      success:true,
      message:"Viewer log saved ✅"
    });

  }catch(error){
    res.status(500).json({
      success:false,
      message:"Viewer log save failed ❌"
    });
  }
});

// GET VIEWER LOGS
router.get("/viewer-logs", async (req,res)=>{
  try{
    const logs = await ViewerLog.find().sort({_id:-1});

    res.json({
      success:true,
      logs
    });

  }catch(error){
    res.status(500).json({
      success:false,
      message:"Viewer logs fetch failed ❌"
    });
  }
});
// SEND REAL OTP SMS
router.post("/send-otp", async (req,res)=>{
  try{
    const { phone } = req.body;

    if(!phone){
      return res.status(400).json({
        success:false,
        message:"Phone number required ❌"
      });
    }
console.log("FAST2SMS KEY =", process.env.FAST2SMS_API_KEY);
    const otp = Math.floor(100000 + Math.random() * 900000);
console.log("API KEY =", process.env.FAST2SMS_API_KEY);
console.log("PHONE =", phone);
    await axios.get("https://www.fast2sms.com/dev/bulkV2",{
      params:{
        authorization:process.env.FAST2SMS_API_KEY,
        route:"otp",
        variables_values:otp,
        numbers:phone
      }
    });

    res.json({
      success:true,
      message:"OTP sent successfully ✅",
      otp:otp
    });

}catch(error){

  console.log("FAST2SMS FULL ERROR:");
console.log(error.response?.data);

  res.status(500).json({
    success:false,
    message:"OTP send failed ❌",
    error:error.response?.data || error.message
  });

}
});
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Auth Route Working ✅"
  });
});
module.exports = router;