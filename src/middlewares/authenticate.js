import jwt from "jsonwebtoken";
import createError from "http-errors";
import User from "../models/user.js";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "accessSecret123";

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");

  if (!token) return next(createError(401, "No access token provided"));

  try {
    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET);
    const user = await User.findById(payload.userId);
    if (!user) return next(createError(401, "User not found"));
    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(createError(401, "Access token expired"));
    }
    return next(createError(401, "Invalid token"));
  }
};

export default authenticate;
