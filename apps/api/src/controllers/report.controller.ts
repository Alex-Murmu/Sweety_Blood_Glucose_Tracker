import { Response } from "express";
import { z } from "zod";
import { prisma } from "../utils/prisma.js";
import { AuthRequest } from "../middlewares/auth.js";
import { HttpError, asyncHandler } from "../middlewares/errorHandler.js";
import { getCached, setCached } from "../utils/redis.js";

const dateSchema = z.object({
  date: z.string().datetime().optional(),
  patientId: z.string().optional(),
});

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function computeStats(readings: Array<{ value: number }>) {
  const count = readings.length;
  if (count === 0) return { highest: null, lowest: null, average: null, count: 0 };
  const values = readings.map((r) => r.value);
  const highest = Math.max(...values);
  const lowest = Math.min(...values);
  const average = Math.round((values.reduce((a, b) => a + b, 0) / count) * 10) / 10;
  return { highest, lowest, average, count };
}

async function targetUserId(req: AuthRequest, patientId?: string): Promise<string> {
  const currentUser = req.user!;
  if (!patientId || patientId === currentUser.id) return currentUser.id;
  if (currentUser.role !== "DOCTOR") throw new HttpError(403, "Doctor access required");
  const assignment = await prisma.doctorPatient.findUnique({
    where: { doctorId_patientId: { doctorId: currentUser.id, patientId } },
  });
  if (!assignment) throw new HttpError(403, "Patient is not assigned to this doctor");
  return patientId;
}

async function report<T>(key: string, create: () => Promise<T>): Promise<T> {
  const cached = await getCached<T>(key);
  if (cached) return cached;
  const value = await create();
  await setCached(key, value);
  return value;
}

export const dailyReport = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { date, patientId } = dateSchema.parse(req.query);
  const target = date ? new Date(date) : new Date();
  const userId = await targetUserId(req, patientId);
  const cacheKey = `report:${userId}:daily:${startOfDay(target).toISOString()}`;
  const result = await report(cacheKey, async () => {
    const readings = await prisma.reading.findMany({
      where: { userId, date: { gte: startOfDay(target), lte: endOfDay(target) } },
      orderBy: [{ slot: "asc" }],
    });
    return {
      success: true,
      report: { type: "daily", date: startOfDay(target).toISOString(), readings, ...computeStats(readings) },
    };
  });
  res.json(result);
});

export const monthToDateReport = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { date, patientId } = dateSchema.parse(req.query);
  const target = date ? new Date(date) : new Date();
  const userId = await targetUserId(req, patientId);
  const monthStart = new Date(target.getFullYear(), target.getMonth(), 1);
  const cacheKey = `report:${userId}:month-to-date:${startOfDay(target).toISOString()}`;
  const result = await report(cacheKey, async () => {
    const readings = await prisma.reading.findMany({
      where: { userId, date: { gte: startOfDay(monthStart), lte: endOfDay(target) } },
      orderBy: [{ date: "asc" }],
    });
    return {
      success: true,
      report: {
        type: "month-to-date",
        from: startOfDay(monthStart).toISOString(),
        to: endOfDay(target).toISOString(),
        readings,
        ...computeStats(readings),
      },
    };
  });
  res.json(result);
});

export const monthlyReport = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { date, patientId } = dateSchema.parse(req.query);
  const target = date ? new Date(date) : new Date();
  const userId = await targetUserId(req, patientId);
  const prevMonth = new Date(target.getFullYear(), target.getMonth() - 1, 1);
  const prevMonthEnd = new Date(target.getFullYear(), target.getMonth(), 0);
  const cacheKey = `report:${userId}:monthly:${startOfDay(prevMonth).toISOString()}`;
  const result = await report(cacheKey, async () => {
    const readings = await prisma.reading.findMany({
      where: { userId, date: { gte: startOfDay(prevMonth), lte: endOfDay(prevMonthEnd) } },
      orderBy: [{ date: "asc" }],
    });
    return {
      success: true,
      report: {
        type: "monthly",
        from: startOfDay(prevMonth).toISOString(),
        to: endOfDay(prevMonthEnd).toISOString(),
        readings,
        ...computeStats(readings),
      },
    };
  });
  res.json(result);
});
