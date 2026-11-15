import { Router } from "express";
import {
  listReadings,
  createReading,
  getReading,
  updateReading,
  deleteReading,
} from "../controllers/reading.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router: Router = Router();

router.use(authMiddleware);

router.get("/", listReadings);
router.post("/", createReading);
router.get("/:id", getReading);
router.put("/:id", updateReading);
router.delete("/:id", deleteReading);

export default router;

