
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const connectDatabase = async (callback) => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB Connected Successfully");
    if (callback) callback();
  } catch (err) {
    console.log(`Error Connecting to DB: ` + err);
  }
};

module.exports.DATA_BASE = { connectDatabase };

