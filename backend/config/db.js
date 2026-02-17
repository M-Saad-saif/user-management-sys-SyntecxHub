const mongoose = require("mongoose");

const connectDB  = async () => {
  const mongo_URI = "mongodb://127.0.0.1:27017/user-manage-sys";
  try {
    await mongoose.connect(mongo_URI);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB ;
