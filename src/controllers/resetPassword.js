import jwt from "jsonwebtoken";
import createError from "http-errors";
import bcrypt from "bcryptjs";
import User from "../models/user.js";


const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw createError(401, "Token is expired or invalid.");
    }

    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      throw createError(404, "User not found!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      refreshToken: null,
    });

    res.status(200).json({
      status: 200,
      message: "Password has been successfully reset.",
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

export default resetPassword;
