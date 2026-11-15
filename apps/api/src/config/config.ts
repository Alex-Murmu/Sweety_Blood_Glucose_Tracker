import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Automatically discover the root .env regardless of working directory
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const candidatePaths = [
  path.resolve(currentDir, "../../../../.env"), // Root .env relative to src/config
  path.resolve(currentDir, "../../../.env"),    // Fallback if running from compiled dist/config
  path.resolve(process.cwd(), ".env"),          // Current directory .env (if executed from root)
  path.resolve(process.cwd(), "../../.env"),     // Relative when cwd is apps/api
];

let envLoaded = false;
for (const p of candidatePaths) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p });
    envLoaded = true;
    break;
  }
}
if (!envLoaded) {
  dotenv.config();
}

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  port: Number(process.env.PORT) || 5000,
  databaseUrl: required("DATABASE_URL"),
  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  cookieName: process.env.COOKIE_NAME || "sweety_token",
  cookieMaxAge: Number(process.env.COOKIE_MAX_AGE) || 7 * 24 * 60 * 60 * 1000,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  redisUrl: process.env.REDIS_URL || "",
  nodeEnv: process.env.NODE_ENV || "development",
} as const;
