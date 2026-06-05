require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const Product = require("./models/Product");


const app = express();
connectDB();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);


app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));


app.get("/", async (req, res) => {
  try {
    const products = await Product.find();
  
    res.render("index", { products });
  } catch (err) {
    console.log("HOME ERROR:", err); // 👈 THIS IS KEY
    res.status(500).send(err.message);
  }
});
app.use("/admin", authRoutes);
app.use('/api/products', productRoutes);



app.get("/admin/login", (req, res) => {
  res.render("admin/login");
});
app.get("/edit-product", (req, res) => {
  res.render("edit-product");
});
app.get("/admin/dashboard", (req, res) => {
  res.render("admin/dashboard");
});

const PORT = process.env.PORT || 5000;

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});