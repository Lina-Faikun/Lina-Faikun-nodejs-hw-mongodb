import jwt from "jsonwebtoken";
import createError from "http-errors";
import User   from "../models/user.js";
import { sendEmail } from "../services/emailservice.js";

const sendResetEmail = async (req, res, next) => {
  console.log("🔧 Контролер sendResetEmail викликано");
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw createError(404, "User not found!");
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });

    const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

    const html = `
      <p>Вітаємо,</p>
      <p>Натисніть на посилання нижче, щоб скинути пароль:</p>
      <a href="${resetLink}">${resetLink}</a>
    `;

    await sendEmail({
      to: email,
      subject: "Password Reset",
      html,
    });

    res.status(200).json({
      status: 200,
      message: "Reset password email has been successfully sent.",
      data: {},
    });
  } catch (error) {
    if (!error.status) {
      return next(
        createError(500, "Failed to send the email, please try again later.")
      );
    }
    next(error);
  }
};

export default sendResetEmail;
