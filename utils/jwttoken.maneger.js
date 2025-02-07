const jwt = require("jsonwebtoken");
require("dotenv").config();

// sign token

module.exports.signToken = ({ claims }) => {
  return jwt.sign(claims, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY || "1d",
  });
};

// // verify token
// module.exports.verifyToken = (token) => {
//   return jwt.verify(token, process.env.JWT_SECRET);
// };

// decode token
module.exports.decodedToken = ({ token }) => {
  return jwt.decode(token, { complete: true });
};


// module.exports.verifyToken = (req, res, next) => {
//   const token = req.header('Authorization');
//   if (!token) {
//     return res.status(401).json({ message: 'Access Denied' });
//   }

//   try {
//     const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET); // Remove "Bearer " prefix if present
//     req.user = decoded; // Attach decoded user data to request
//     next(); // Continue to next middleware
//   } catch (error) {
//     return res.status(403).json({ message: 'Invalid or Expired Token' });
//   }
// };


module.exports.verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization'); // Get the Authorization header

  console.log("🔹 Received Authorization Header:", authHeader); // ✅ Debug log

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error("❌ Missing or malformed token");
    return res.status(401).json({ message: "Access Denied. No valid token provided." });
  }

  const token = authHeader.split(' ')[1]; // Extract token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    console.log("✅ Decoded Token:", decoded); // ✅ Debug log
    req.user = decoded; // Attach user data
    next();
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    return res.status(403).json({ message: "Invalid or Expired Token" });
  }
};


