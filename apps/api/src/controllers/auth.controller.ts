import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../utils/prisma.js";
import { config } from "../config/config.js";
import { HttpError, asyncHandler } from "../middlewares/errorHandler.js";
import { AuthRequest } from "../middlewares/auth.js";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

function setTokenCookie(res: Response, token: string) {
  res.cookie(config.cookieName, token, {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "lax",
    maxAge: config.cookieMaxAge,
    path: "/",
  });
}

export const signup = asyncHandler(
  async (req: Request, res: Response) => {
    const body = signupSchema.parse(req.body);

    const existing = await prisma.user.findUnique({
      where: { email: body.email },
    });
    if (existing) {
      throw new HttpError(400, "Email already registered");
    }

    const passwordHash = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: passwordHash,
      },
      select: { id: true, name: true, email: true },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn } as SignOptions
    );

    setTokenCookie(res, token);

    res.status(201).json({
      success: true,
      message: "Account created",
      user,
    });
  }
);

export const login = asyncHandler(async (req: Request, res: Response) => {
  const body = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { email: body.email },
  });
  if (!user) {
    throw new HttpError(401, "Invalid email or password");
  }

  const valid = await bcrypt.compare(body.password, user.password);
  if (!valid) {
    throw new HttpError(401, "Invalid email or password");
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn } as SignOptions
  );

  setTokenCookie(res, token);

  res.json({
    success: true,
    message: "Logged in",
    user: { id: user.id, name: user.name, email: user.email },
  });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie(config.cookieName, { path: "/" });
  res.json({ success: true, message: "Logged out" });
});

export const me = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user?.id },
    select: { id: true, name: true, email: true },
  });
  if (!user) {
    throw new HttpError(404, "User not found");
  }
  res.json({ success: true, user });
});

