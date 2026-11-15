import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "prisma/config";

// Automatically discover the root .env regardless of working directory
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const candidatePaths = [
  path.resolve(currentDir, "../../.env"),     // Root .env from apps/api
  path.resolve(process.cwd(), ".env"),       // Running from root
  path.resolve(process.cwd(), "../../.env"),  // Running from apps/api
];

for (const p of candidatePaths) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p });
    break;
  }
}
dotenv.config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
