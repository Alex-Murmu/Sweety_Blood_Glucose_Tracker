import { Response } from "express";
import { z } from "zod";
import { prisma } from "../utils/prisma.js";
import { AuthRequest } from "../middlewares/auth.js";
import { HttpError, asyncHandler } from "../middlewares/errorHandler.js";

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

export const assignPatient = asyncHandler(async (req: AuthRequest, res: Response) => {
  const doctorId = requireDoctor(req);
  const { patientId } = assignmentSchema.parse(req.body);
  const patient = await prisma.user.findFirst({ where: { id: patientId, role: "PATIENT" } });
  if (!patient) throw new HttpError(404, "Patient not found");
  const assignment = await prisma.doctorPatient.upsert({
    where: { doctorId_patientId: { doctorId, patientId } },
    update: {},
    create: { doctorId, patientId },
    include: { patient: { select: { id: true, name: true, email: true } } },
  });
  res.status(201).json({ success: true, patient: assignment.patient });
});
