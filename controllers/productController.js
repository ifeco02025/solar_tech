const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");


// ========================
// UPLOAD TO CLOUDINARY
// ========================
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "solar-products",
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};




exports.createProduct = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const {
      title,
      category,
      description,
      price,
      specifications,
    } = req.body;

    // ✅ UPLOAD IMAGES PROPERLY
    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      imageUrls = await Promise.all(
        req.files.map(async (file) => {
          const result = await uploadToCloudinary(file.buffer);
          return result.secure_url;
        })
      );
    }

    console.log("IMAGE URLS:", imageUrls);

    let specs = [];

    if (specifications) {
      try {
        specs = JSON.parse(specifications);
      } catch {
        specs = specifications.split(",");
      }
    }

    const product = await Product.create({
      title,
      category,
      description,
      price,
      specifications: specs,
      images: imageUrls,
    });

    res.status(201).json(product);
  } catch (error) {
    console.log("CREATE ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};





// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    const {
      title,
      category,
      description,
      price,
      specifications
    } = req.body;

    // KEEP OLD IMAGES
    let imageUrls = product.images;

    // IF NEW IMAGES UPLOADED
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map(file => file.path);
    }

    // FIX SPECIFICATIONS
    let specs = [];

    if (specifications) {
      try {

        specs = typeof specifications === "string"
          ? JSON.parse(specifications)
          : specifications;

      } catch (err) {
        specs = [];
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        title,
        category,
        description,
        price,
        specifications: specs,
        images: imageUrls
      },
      {
        new: true
      }
    );

    res.json(updatedProduct);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message
    });
  }
};


// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // DELETE IMAGES FROM CLOUDINARY
    if (product.images && product.images.length > 0) {
      for (let img of product.images) {
        const publicId = img.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`solar-products/${publicId}`);
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};