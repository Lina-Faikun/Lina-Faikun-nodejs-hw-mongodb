import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import createError from "http-errors";
import User from "../models/user.js";
import Session from "../models/session.js";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "accessSecret123";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refreshSecret456";

const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "30d";

export const register = async (userData) => {
  const { name, email, password } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw createError(409, "Email in use");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({ name, email, password: hashedPassword });

  const { password: _, ...userWithoutPassword } = user.toObject();
  return userWithoutPassword;
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw createError(401, "Invalid email or password");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw createError(401, "Invalid email or password");

  // видалити попередні сесії користувача
  await Session.deleteMany({ userId: user._id });

  const accessToken = jwt.sign({ userId: user._id }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
  const refreshToken = jwt.sign({ userId: user._id }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });

  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 хв
  const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 днів

  const session = await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { accessToken, refreshToken, sessionId: session._id };
};

export const refresh = async (refreshToken) => {
  try {
    const payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    const session = await Session.findOne({ userId: payload.userId, refreshToken });
    if (!session) throw createError(401, "Invalid session");

    // видалити стару сесію
    await Session.findByIdAndDelete(session._id);

    const accessToken = jwt.sign({ userId: payload.userId }, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
    const newRefreshToken = jwt.sign({ userId: payload.userId }, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });

    const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 хв
    const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 днів

    const newSession = await Session.create({
      userId: payload.userId,
      accessToken,
      refreshToken: newRefreshToken,
      accessTokenValidUntil,
      refreshTokenValidUntil,
    });

    return { accessToken, refreshToken: newRefreshToken, sessionId: newSession._id };
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw createError(401, "Refresh token expired");
    }
    throw createError(401, "Invalid refresh token");
  }
};

export const logout = async (sessionId) => {
  const session = await Session.findById(sessionId);
  if (!session) return;

  // Видаляємо сесію за ID + userId + accessToken
  await Session.deleteOne({
    _id: sessionId,
    userId: session.userId,
    accessToken: session.accessToken,
  });
};
