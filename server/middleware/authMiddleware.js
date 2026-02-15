import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request
      req.user = await User.findById(decoded.id).select("-password");

      return next();
    }

    // No token found
    return res.status(401).json({
      message: "No token, authorization denied",
    });

  } catch (error) {
    return res.status(401).json({
      message: "Not authorized, token failed",
    });
  }
};

export default protect;
