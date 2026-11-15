import { Router, type Router as RouterType } from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { assignPatient, listPatients } from "../controllers/doctor.controller.js";

const router: RouterType = Router();
router.use(authMiddleware);
router.get("/patients", listPatients);
router.post("/patients", assignPatient);

export default router;
