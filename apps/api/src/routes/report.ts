import { Router } from "express";
import {
  dailyReport,
  monthToDateReport,
  monthlyReport,
} from "../controllers/report.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router: Router = Router();

router.use(authMiddleware);

router.get("/daily", dailyReport);
router.get("/month-to-date", monthToDateReport);
router.get("/monthly", monthlyReport);

export default router;

