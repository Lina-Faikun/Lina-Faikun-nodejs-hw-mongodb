import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createError from "http-errors";
import { v4 as uuidv4 } from "uuid";
import User from "../models/user.js";
import Session from "../models/session.js";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "accessSecret123";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refreshSecret123";
const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "30d";

export const register = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw createError(409, "Email in use");

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ name, email, password: hashedPassword });

  const userObject = newUser.toObject();
  delete userObject.password;
  return userObject;
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw createError(401, "Invalid credentials");

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) throw createError(401, "Invalid credentials");

  await Session.deleteMany({ userId: user._id });

  const tokens = generateTokens(user._id);

  await Session.create({ userId: user._id, ...tokens });

  return { user, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
};

export const refresh = async (refreshToken) => {
  if (!refreshToken) throw createError(401, "No refresh token provided");

  let payload;
  try {
    payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
  } catch {
    throw createError(403, "Invalid refresh token");
  }

  const session = await Session.findOne({ refreshToken });
  if (!session) throw createError(403, "Session not found or expired");

  await Session.deleteMany({ userId: payload.userId });

  const tokens = generateTokens(payload.userId);

  await Session.create({ userId: payload.userId, ...tokens });

  return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
};

export const logout = async (refreshToken) => {
  if (!refreshToken) throw createError(401, "No refresh token provided");
  await Session.deleteOne({ refreshToken });
};

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });

  const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });

  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
  const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  return { accessToken, refreshToken, accessTokenValidUntil, refreshTokenValidUntil };
};
