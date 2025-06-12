// src/services/auth.js
export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw createError(401, "Invalid credentials");

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) throw createError(401, "Invalid credentials");

  await Session.deleteMany({ userId: user._id });

  const tokens = generateTokens(user._id);
  const session = await Session.create({ userId: user._id, ...tokens });

  return { user, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, session };
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

  return { accessToken: tokens.accessToken, newRefreshToken: tokens.refreshToken };
};

export const logout = async (sessionId) => {
  await Session.findByIdAndDelete(sessionId);
};
