import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createError from "http-errors";

import User from "../models/user.js";
import Session from "../models/session.js";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "30d";

export const register = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) throw createError(409, "Email in use");

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });

  const result = user.toObject();
  delete result.password;
  return result;
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw createError(401, "Invalid credentials");

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) throw createError(401, "Invalid credentials");

  await Session.deleteMany({ userId: user._id });

  const tokens = generateTokens(user._id);
  const session = await Session.create({ userId: user._id, ...tokens });

  return {
    user,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    session,
  };
};

export const refresh = async (refreshToken, sessionId) => {
  if (!refreshToken || !sessionId) throw createError(401, "Missing tokens");

  let payload;
  try {
    payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
  } catch {
    throw createError(403, "Invalid refresh token");
  }

  const session = await Session.findById(sessionId);
  if (!session || session.refreshToken !== refreshToken) {
    throw createError(403, "Session not found or token mismatch");
  }

  await Session.findByIdAndDelete(sessionId);

  const tokens = generateTokens(payload.userId);
  await Session.create({ userId: payload.userId, ...tokens });

  return {
    accessToken: tokens.accessToken,
    newRefreshToken: tokens.refreshToken,
  };
};

export const logout = async (sessionId) => {
  await Session.findByIdAndDelete(sessionId);
};

function generateTokens(userId) {
  const accessToken = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
  const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });

  return { accessToken, refreshToken };
}
