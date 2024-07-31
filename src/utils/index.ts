import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = parseInt(process.env.SALT_ROUNDS || "10", 10);
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (
  providedPassword: string,
  storedHashedPassword: string,
): Promise<boolean> => {
  const result = await bcrypt.compare(providedPassword, storedHashedPassword);
  return result;
};

export const validateEmail = (email: string): boolean => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

export const validatePassword = (password: string): boolean => {
  const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordPattern.test(password);
};

export const generateToken = (user: any): string => {
  return jwt.sign(user, process.env.JWT_SECRET || "secret", {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, process.env.JWT_SECRET || "secret");
};

export const sendEmail = async (to: string, subject: string, text: string) => {
  // Implement email sending logic here
  console.log(`Sending email to ${to}:`, subject, text);
  return true;
};
