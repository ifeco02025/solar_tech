require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Admin = require("./models/Admin");

mongoose.connect(process.env.MONGODB_ATLAS_API)
.then(async () => {

  const hashedPassword = await bcrypt.hash("123456", 10);

  await Admin.create({
    username: "admin",
    password: hashedPassword,
  });

  console.log("Admin Created");

  process.exit();
});