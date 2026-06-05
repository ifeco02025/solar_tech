const jwt = require("jsonwebtoken");

const verifyAdmin = (req, res, next) => {

  const authHeader = req.headers.authorization;

  // Check Token
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  // Bearer Token
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  try {

    // Verify JWT
    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Save Admin Data
    req.admin = verified;

    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Invalid or Expired Token",
    });

  }

};

module.exports = verifyAdmin;