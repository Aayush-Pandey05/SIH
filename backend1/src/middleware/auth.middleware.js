import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, resizeBy, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }
    const decoded = jwt.verify(token, process.env.SECRET); // we are verifying the user ;
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized:- Invalid token" });
    }
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in the protectRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal Server error" });
  }
};
