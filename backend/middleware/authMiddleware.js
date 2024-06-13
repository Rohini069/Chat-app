const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const JWT_SECRET = "secret";

const protect = asyncHandler(async (req, res, next) => {
  let token;
  console.log("Request Headers:", req.headers);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("Received token", token);

      const decoded = jwt.verify(token, JWT_SECRET);
      console.log("Decoded token:", decoded);

      if (!decoded.id) {
        throw new Error("Token does not contain user ID");
      }

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error("Token verification error:", error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    console.log("No token found");
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };
