// const express = require("express");
// const router = express.Router();

// const { loginAdmin } = require("../controllers/authController");

// router.post("/login", loginAdmin);

// module.exports = router;



const express = require("express");
const router = express.Router();

const { loginAdmin } = require("../controllers/authController");


// =========================
// ADMIN PAGES
// =========================

// Login Page
router.get("/login", (req, res) => {
  res.render("admin/login");
});

// Dashboard Page
router.get("/dashboard", (req, res) => {
  res.render("admin/dashboard");
});


// =========================
// AUTH API
// =========================

// Admin Login API
router.post("/login", loginAdmin);

module.exports = router;