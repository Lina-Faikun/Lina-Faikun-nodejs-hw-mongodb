import jwt from "jsonwebtoken";
import createError from "http-errors";
import User from "../models/user.js";
import Session from "../models/session.js";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "accessSecret123";

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const [bearer, token] = authHeader.split(" ");

    if (bearer !== "Bearer" || !token) {
      throw createError(401, "No access token provided");
    }

    
    let payload;
    try {
      payload = jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        throw createError(401, "Access token expired");
      }
      throw createError(401, "Invalid token");
    }

   
    const session = await Session.findOne({
      userId: payload.userId,
      accessToken: token,
    });

    if (!session) {
      throw createError(401, "Session invalid or expired");
    }

    
    const user = await User.findById(payload.userId);
    if (!user) {
      throw createError(401, "User not found");
    }

 
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default authenticate;
