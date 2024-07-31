import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { models } from "../models";
import dotenv from "dotenv";
import logger from "../logs/logger";

dotenv.config();

const User = models.User;
const JWT_SECRET = process.env.JWT_SECRET || "secret";

// Define the User type
type UserType = (typeof User)["prototype"];

// Extend the Request interface to include user property
interface AuthenticatedRequest extends Request {
  user?: UserType;
}

export const verifyToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  const authHeader = req.header("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    logger.warn("Auth Middleware: No token provided");
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { _id: number };
    const user = await User.findByPk(decoded._id);

    if (!user) {
      logger.warn(
        `Auth Middleware: User not found for token payload id ${decoded._id}`,
      );
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error("Auth Middleware: Invalid token", { error });
    return res.status(400).json({ message: "Invalid token" });
  }
};
