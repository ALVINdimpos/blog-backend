import { Request, Response } from "express";
import { validationResult, body } from "express-validator";
import logger from "../logs/logger";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { models } from "../models";
import {
  hashPassword,
  validateEmail,
  validatePassword,
  generateToken,
  sendEmail,
  verifyToken,
} from "../utils";

const { User, Role } = models;
const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const register = [
  body("username").notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("roleId").isInt().withMessage("Valid role ID is required"),

  async (req: Request, res: Response): Promise<Response> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error("Register User: Error in register validation", {
        errors: errors.array(),
      });
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { username, email, password, roleId } = req.body;

      if (!validateEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      if (!validatePassword(password)) {
        return res
          .status(400)
          .json({ message: "Password does not meet criteria" });
      }

      let user = await User.findOne({ where: { email } });
      if (user) {
        logger.error("Register User: User already exists with email " + email);
        return res.status(400).json({ message: "User already exists" });
      }

      const role = await Role.findByPk(roleId);
      if (!role) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const hashedPassword = await hashPassword(password);

      user = await User.create({
        username,
        email,
        password: hashedPassword,
        roleId,
      });

      console.log("User created:", user.toJSON());

      logger.info("Register User: New user registered successfully");
      return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      logger.error("Register User: Error in registering user", { error });
      return res.status(500).json({ message: "Error registering the user" });
    }
  },
];

export const login = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),

  async (req: Request, res: Response): Promise<Response> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { email, password } = req.body;
      console.log("Login attempt - Email:", email);
      console.log("Login attempt - Provided password:", password);

      if (!validateEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        console.log("User not found");
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      console.log("Password match result:", isMatch);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ _id: user.id, role: user.roleId }, JWT_SECRET, {
        expiresIn: "1d",
      });
      logger.info("Login User: User logged in successfully");
      return res.json({
        message: "User logged in successfully",
        token,
        user: {
          _id: user.id,
          username: user.username,
          email: user.email,
          role: user.roleId,
        },
      });
    } catch (error) {
      logger.error("Login User: Error in login", { error });
      return res.status(500).json({ message: "Error logging in" });
    }
  },
];

export const forgotPassword = [
  body("email").isEmail().withMessage("Valid email is required"),

  async (req: Request, res: Response): Promise<Response> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findOne({ where: { email: req.body.email } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const token = generateToken({ _id: user.id });
      const resetLink = `http://yourfrontend.com/reset-password/${token}`;

      await sendEmail(
        user.email,
        "Password Reset Request",
        `Please click on the following link to reset your password: ${resetLink}`,
      );

      return res.json({ message: "Password reset email sent" });
    } catch (error) {
      logger.error("Forgot Password: Error in sending password reset email", {
        error,
      });
      return res
        .status(500)
        .json({ message: "Error sending password reset email" });
    }
  },
];

export const resetPassword = [
  body("token").notEmpty().withMessage("Token is required"),
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),

  async (req: Request, res: Response): Promise<Response> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { token, newPassword } = req.body;
      const decoded: any = verifyToken(token);

      const user = await User.findByPk(decoded._id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!validatePassword(newPassword)) {
        return res
          .status(400)
          .json({ message: "Password does not meet criteria" });
      }

      user.password = await hashPassword(newPassword);
      await user.save();

      return res.json({ message: "Password has been reset successfully" });
    } catch (error) {
      logger.error("Reset Password: Error in resetting password", { error });
      return res.status(500).json({ message: "Error resetting password" });
    }
  },
];
