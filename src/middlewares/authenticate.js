// src/middlewares/authenticate.js
import jwt from "jsonwebtoken";
import createError from "http-errors";
import User from "../models/user.js";
import Session from "../models/session.js";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "accessSecret123";

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");

  if (!token) return next(createError(401, "No access token provided"));

  try {
    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET);

    const session = await Session.findOne({ userId: payload.userId, accessToken: token });
    if (!session) return next(createError(401, "Session invalid or expired"));

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
