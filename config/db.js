const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("connect success");
  } catch (error) {
    console.log("connection failed", error.message);
  }
};

module.exports = connectDB;
