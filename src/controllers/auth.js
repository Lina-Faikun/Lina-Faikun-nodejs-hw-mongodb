import * as authService from "../services/auth.js";
import { registerSchema, loginSchema, emailSchema, resetPasswordSchema } from "../validations/authValidation.js";
import createError from "http-errors";
import jwt from "jsonwebtoken";
import  User  from "../models/user.js"; 
import { sendEmail } from "../services/email.service.js";
import bcrypt from "bcryptjs";

export const register = async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) throw createError(400, error.message);

    const result = await authService.register(req.body);
    res.status(201).json({
      status: "success",
      message: "Successfully registered a user!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) throw createError(400, error.message);

    const { user, accessToken, refreshToken, session } = await authService.login(req.body);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.cookie("sessionId", session._id.toString(), {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: "success",
      message: "Successfully logged in a user!",
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken, sessionId } = req.cookies;
    if (!refreshToken || !sessionId) throw createError(401, "Missing cookies");

    const { accessToken, newRefreshToken } = await authService.refresh(refreshToken, sessionId);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: "success",
      message: "Successfully refreshed a session!",
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { sessionId } = req.cookies;
    if (!sessionId) throw createError(401, "Session not found");

    await authService.logout(sessionId);

    res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "none" });
    res.clearCookie("sessionId", { httpOnly: true, secure: true, sameSite: "none" });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

// 🆕 Надсилання email для скидання паролю
export const sendResetEmail = async (req, res, next) => {
  try {
    const { error } = emailSchema.validate(req.body);
    if (error) throw createError(400, error.message);

    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw createError(404, "User not found!");

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "5m" });
    const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

    const html = `<p>To reset your password, click the link below:</p><a href="${resetLink}">Reset Password</a>`;

    await sendEmail({
      to: email,
      subject: "Reset your password",
      html,
    });

    res.status(200).json({
      status: 200,
      message: "Reset password email has been successfully sent.",
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// 🆕 Обробка скидання паролю
export const resetPassword = async (req, res, next) => {
  try {
    const { error } = resetPasswordSchema.validate(req.body);
    if (error) throw createError(400, error.message);

    const { token, password } = req.body;
    let email;

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      email = payload.email;
    } catch {
      throw createError(401, "Token is expired or invalid.");
    }

    const user = await User.findOne({ email });
    if (!user) throw createError(404, "User not found!");

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.status(200).json({
      status: 200,
      message: "Password has been successfully reset.",
      data: {},
    });
  } catch (err) {
    next(err);
  }
};
