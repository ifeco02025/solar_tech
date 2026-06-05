const express = require("express");
const router = express.Router();

const multer = require("multer");
const { CloudinaryStorage } = require("multer");
const cloudinary = require("../config/cloudinary");

const verifyAdmin = require("../middleware/verifyAdmin");

const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// console.log({
//   createProduct,
//   getProducts,
//   updateProduct,
//   deleteProduct,
//   verifyAdmin
// });
// ========================
// CLOUDINARY STORAGE
// ========================
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "solar-products",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage });


// ========================
// ROUTES
// ========================

// GET all products
router.get("/", getProducts);

// CREATE product + upload images
router.post(
  "/",
  verifyAdmin,
  upload.array("images", 5),
  createProduct
);


// UPDATE product
// router.put("/:id", verifyAdmin, updateProduct);
router.put(
  "/:id",
  verifyAdmin,
  upload.array("images", 5),
  updateProduct
);
// DELETE product
router.delete("/:id", verifyAdmin, deleteProduct);

module.exports = router;