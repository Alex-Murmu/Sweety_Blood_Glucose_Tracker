import { Router, type Router as RouterType } from "express";
import { authMiddleware } from "../middlewares/auth.js";
import {
  assignPatient,
  listAvailablePatients,
  listPatients,
  runReminderEndpoint,
  unassignPatient,
} from "../controllers/doctor.controller.js";

const router: RouterType = Router();
router.use(authMiddleware);
router.get("/patients", listPatients);
router.get("/directory", listAvailablePatients);
router.post("/patients", assignPatient);
router.delete("/patients/:patientId", unassignPatient);
router.post("/reminders/run", runReminderEndpoint);
router.get("/reminders/status", runReminderEndpoint);

export default router;
