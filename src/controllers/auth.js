import * as authService from "../services/auth.js";
import { registerSchema, loginSchema } from "../validations/authValidation.js";
import createError from "http-errors";

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
