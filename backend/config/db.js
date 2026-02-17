const mongoose = require("mongoose");

const connectDB = async () => {
  const mongo_URI =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/user-manage-sys";
  try {
    await mongoose.connect(mongo_URI);

    const host = mongoose.connection.host;
    if (host.includes("mongodb.net")) {
      console.log("connected to mongo (Atlas)");
    } else {
      console.log("connected to mongo (Local)");
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
