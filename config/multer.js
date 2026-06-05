const multer = require("multer");
const { CloudinaryStorage } = require("multer");
const cloudinary = require("./cloudinary");

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "solar_products",
//     allowed_formats: ["jpg", "png", "jpeg", "webp"],
//   },
// });
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "solar-products",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    public_id: (req, file) => Date.now() + "-" + file.originalname,
  },
});
const upload = multer({ storage });

module.exports = upload;