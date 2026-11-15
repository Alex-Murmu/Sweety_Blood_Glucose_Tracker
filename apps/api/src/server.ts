import express, { type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import { config } from "./config/config.js";
import { prisma } from "./utils/prisma.js";
import authRoutes from "./routes/auth.js";
import readingRoutes from "./routes/reading.js";
import reportRoutes from "./routes/report.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";

const app = express();
const PORT = config.port;

app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

let dbConnected = false;

async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbConnected = true;
    console.log("[DB] Connected to PostgreSQL successfully.");
    return true;
  } catch (err) {
    dbConnected = false;
    const message = err instanceof Error ? err.message : String(err);
    console.error("[DB] Failed to connect to PostgreSQL:", message);
    return false;
  }
}

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Sweety Api is Running",
    database: dbConnected ? "connected" : "disconnected",
  });
});

app.use("/auth", authRoutes);
app.use("/readings", readingRoutes);
app.use("/reports", reportRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

checkDatabaseConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Sweety Server is running successfully on port http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("[DB] Connection check failed, starting server anyway:", err);
    app.listen(PORT, () => {
      console.log(`Sweety Server is running successfully on port http://localhost:${PORT}`);
    });
  });
