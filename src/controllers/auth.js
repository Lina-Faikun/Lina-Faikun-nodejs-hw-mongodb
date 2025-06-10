import * as authService from "../services/auth.js";

export const register = async (req, res, next) => {
  try {
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
    const { user, accessToken, refreshToken } = await authService.login(req.body);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({
      status: "success",
      message: "Successfully logged in an user!",
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = await authService.refresh(req.cookies.refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
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
    await authService.logout(req.cookies.refreshToken);
    res.clearCookie("refreshToken");
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
