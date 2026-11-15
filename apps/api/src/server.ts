import express, { type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import { config } from "./config/config.js";
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

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Sweety Api is Running",
  });
});

app.use("/auth", authRoutes);
app.use("/readings", readingRoutes);
app.use("/reports", reportRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Sweety Server is running successfully on port http://localhost:${PORT}`);
});

