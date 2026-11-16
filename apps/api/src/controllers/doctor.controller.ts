import { Response } from "express";
import { z } from "zod";
import { prisma } from "../utils/prisma.js";
import { AuthRequest } from "../middlewares/auth.js";
import { HttpError, asyncHandler } from "../middlewares/errorHandler.js";
import { runDailyReminderCheck } from "../jobs/reminder.js";

const assignmentSchema = z.object({ patientId: z.string().min(1) });

function requireDoctor(req: AuthRequest): string {
  if (req.user?.role !== "DOCTOR") throw new HttpError(403, "Doctor access required");
  return req.user.id;
}

export const listPatients = asyncHandler(async (req: AuthRequest, res: Response) => {
  const doctorId = requireDoctor(req);
  const assignments = await prisma.doctorPatient.findMany({
    where: { doctorId },
    include: { patient: { select: { id: true, name: true, email: true } } },
    orderBy: { assignedAt: "desc" },
  });
  res.json({ success: true, patients: assignments.map((assignment) => assignment.patient) });
});

export const listAvailablePatients = asyncHandler(async (req: AuthRequest, res: Response) => {
  requireDoctor(req);
  const patients = await prisma.user.findMany({
    where: { role: "PATIENT" },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });
  res.json({ success: true, patients });
});

export const assignPatient = asyncHandler(async (req: AuthRequest, res: Response) => {
  const doctorId = requireDoctor(req);
  const { patientId } = assignmentSchema.parse(req.body);
  const identifier = patientId.trim();

  // Find by ID or Email
  const patient = await prisma.user.findFirst({
    where: {
      role: "PATIENT",
      OR: [
        { id: identifier },
        { email: { equals: identifier, mode: "insensitive" } },
      ],
    },
  });
  if (!patient) throw new HttpError(404, "No patient found with that email or ID");

  const assignment = await prisma.doctorPatient.upsert({
    where: { doctorId_patientId: { doctorId, patientId: patient.id } },
    update: {},
    create: { doctorId, patientId: patient.id },
    include: { patient: { select: { id: true, name: true, email: true } } },
  });
  res.status(201).json({ success: true, patient: assignment.patient });
});

export const unassignPatient = asyncHandler(async (req: AuthRequest, res: Response) => {
  const doctorId = requireDoctor(req);
  const { patientId } = req.params as { patientId: string };
  await prisma.doctorPatient.deleteMany({
    where: { doctorId, patientId },
  });
  res.json({ success: true, message: "Patient unassigned successfully" });
});

export const runReminderEndpoint = asyncHandler(async (req: AuthRequest, res: Response) => {
  requireDoctor(req);
  const result = await runDailyReminderCheck();
  res.json({ success: true, ...result });
});
