// const mongoose = require('mongoose');
// const dotenv = require('dotenv').config();

// const connectDatabase = async (callback) => {
//     try {
//         await mongoose.connect(process.env.MONGO_URL);
//         console.log('DB Connected Successfully');
//         if (callback) callback();
//     } catch (err) {
//         console.log(`Error Connecting to DB: ` + err);
//     }
// };

// module.exports.DATA_BASE = {connectDatabase};


const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const connectDatabase = async (callback) => {
  try {
//     mongoose.connect(process.env.MONGO_DEV_URI)
    await mongoose.connect(process.env.MONGO_DEV_URI);
    console.log("DB Connected Successfully");
    if (callback) callback();
  } catch (err) {
    console.log(`Error Connecting to DB: ` + err);
  }
};

module.exports.DATA_BASE = { connectDatabase };

