const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_ATLAS_API);

    console.log("MongoDB Connected");

  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;