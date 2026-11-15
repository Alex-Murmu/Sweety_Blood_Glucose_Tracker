import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { HttpError } from "./errorHandler.js";

export interface AuthRequest extends Request {
  user?: { id: string; email: string; name: string };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies[config.cookieName];

  if (!token) {
    return next(new HttpError(401, "Not authenticated"));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as {
      id: string;
      email: string;
      name: string;
    };
    req.user = decoded;
    next();
  } catch {
    return next(new HttpError(401, "Invalid or expired token"));
  }
};
