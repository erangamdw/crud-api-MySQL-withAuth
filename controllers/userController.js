const UserModel = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const util = require("util");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const compareAsync = util.promisify(bcrypt.compare);

const sendPasswordResetEmail = (recipientEmail, resetToken) => {
  // Replace the placeholders with your actual email credentials and settings
  const transporter = nodemailer.createTransport({
    service: "Gmail", // e.g., "Gmail" for Gmail accounts
    auth: {
      user: process.env.GMAIL_USER, // your email address
      pass: process.env.GMAIL_APP_PASS, // your email password or app password for secure access
    },
  });

  // Email content
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: recipientEmail,
    subject: "Password Reset Instructions",
    html: `<p>Hello,</p><p>Please click on the following link to reset your password:${resetToken}</p>`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

const register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const existingUser = await UserModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists." });
    }

    const userId = await UserModel.registerUser({ email, password });
    res.status(201).json({ message: "User created successfully.", userId });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error creating user." });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const userModel = new UserModel();
  const user = await userModel.findUserByEmail(email);

  if (!user) {
    return res.status(401).json({ message: "No user found" });
  }

  try {
    const result = await compareAsync(password, user.password);
    if (!result) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
      expiresIn: "5m",
    });
    res.json({ message: "Login successful.", token });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error during login." });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const userModel = new UserModel();
    const user = await userModel.findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a unique reset token using crypto
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Save the reset token and its expiration date in the user document
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 300000; // Token will expire in 5 minutes

    // Update the user in the database with the new reset token and expiration date
    await userModel.updateUser(user);

    // Send the password reset email to the user
    sendPasswordResetEmail(email, resetToken);

    res.json({
      message:
        "An email with instructions to reset your password has been sent to your email address.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error during forgot password." });
  }
};

const resetPassword = async (req, res) => {
  const { resetToken, email, newPassword } = req.body;

  if (!resetToken || !newPassword) {
    return res
      .status(400)
      .json({ message: "Reset token and newPassword are required." });
  }

  try {
    const userModel = new UserModel();
    const user = await userModel.findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.resetPasswordToken === resetToken) {
      if (user.resetPasswordExpires > Date.now()) {
        // Verify the reset token
        // Update the user's password with the new password
        user.password = newPassword;
        user.resetPasswordToken = null; // Remove the reset token after successful reset
        user.resetPasswordExpires = null; // Remove the reset token expiration after successful reset

        // Update the user in the database with the new password and cleared reset token fields
        await userModel.updateUser(user); // Save the changes to the database

        return res.json({ message: "Password reset successful." });
      } else {
        return res.status(400).json({ message: "Reset token has expired." });
      }
    } else {
      return res.status(400).json({ message: "Invalid reset token." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error resetting password." });
  }
};

module.exports = {
  login,
  register,
  forgotPassword,
  resetPassword,
};
