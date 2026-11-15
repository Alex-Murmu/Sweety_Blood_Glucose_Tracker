import { Response } from "express";
import { z } from "zod";
import { prisma } from "../utils/prisma.js";
import { AuthRequest } from "../middlewares/auth.js";
import { asyncHandler } from "../middlewares/errorHandler.js";

const dateSchema = z.object({
  date: z.string().datetime().optional(),
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
  if (count === 0) {
    return { highest: null, lowest: null, average: null, count: 0 };
  }
  const values = readings.map((r) => r.value);
  const highest = Math.max(...values);
  const lowest = Math.min(...values);
  const average = Math.round((values.reduce((a, b) => a + b, 0) / count) * 10) / 10;
  return { highest, lowest, average, count };
}

export const dailyReport = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { date } = dateSchema.parse(req.query);
    const target = date ? new Date(date) : new Date();

    const readings = await prisma.reading.findMany({
      where: {
        userId,
        date: {
          gte: startOfDay(target),
          lte: endOfDay(target),
        },
      },
      orderBy: [{ slot: "asc" }],
    });

    const stats = computeStats(readings);

    res.json({
      success: true,
      report: {
        type: "daily",
        date: startOfDay(target).toISOString(),
        readings,
        ...stats,
      },
    });
  }
);

export const monthToDateReport = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { date } = dateSchema.parse(req.query);
    const target = date ? new Date(date) : new Date();

    const monthStart = new Date(target.getFullYear(), target.getMonth(), 1);

    const readings = await prisma.reading.findMany({
      where: {
        userId,
        date: {
          gte: startOfDay(monthStart),
          lte: endOfDay(target),
        },
      },
      orderBy: [{ date: "asc" }],
    });

    const stats = computeStats(readings);

    res.json({
      success: true,
      report: {
        type: "month-to-date",
        from: startOfDay(monthStart).toISOString(),
        to: endOfDay(target).toISOString(),
        readings,
        ...stats,
      },
    });
  }
);

export const monthlyReport = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { date } = dateSchema.parse(req.query);
    const target = date ? new Date(date) : new Date();

    const prevMonth = new Date(target.getFullYear(), target.getMonth() - 1, 1);
    const prevMonthEnd = new Date(
      target.getFullYear(),
      target.getMonth(),
      0
    );

    const readings = await prisma.reading.findMany({
      where: {
        userId,
        date: {
          gte: startOfDay(prevMonth),
          lte: endOfDay(prevMonthEnd),
        },
      },
      orderBy: [{ date: "asc" }],
    });

    const stats = computeStats(readings);

    res.json({
      success: true,
      report: {
        type: "monthly",
        from: startOfDay(prevMonth).toISOString(),
        to: endOfDay(prevMonthEnd).toISOString(),
        readings,
        ...stats,
      },
    });
  }
);

