const express = require("express");
const router = express.Router();

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const verifyAdmin = require("../middleware/verifyAdmin");
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// CLOUDINARY STORAGE (BACK TO SIMPLE WAY)
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "solar-products",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage });

// ROUTES
router.post("/", verifyAdmin, upload.array("images", 5), createProduct);
router.get("/", getProducts);
router.put("/:id", verifyAdmin, upload.array("images", 5), updateProduct);
router.delete("/:id", verifyAdmin, deleteProduct);

module.exports = router;