import { Response } from "express";
import { z } from "zod";
import { prisma } from "../utils/prisma.js";
import { AuthRequest } from "../middlewares/auth.js";
import { HttpError, asyncHandler } from "../middlewares/errorHandler.js";

export const readingSchema = z.object({
  date: z.string().datetime({ message: "Invalid date format" }),
  slot: z.enum(["MORNING", "AFTER_BREAKFAST", "AFTER_LUNCH", "AFTER_DINNER"]),
  value: z
    .number()
    .int("Value must be a whole number.")
    .min(40, "Value must be between 40 and 600 mg/dl.")
    .max(600, "Value must be between 40 and 600 mg/dl.")
    .optional(),
});

const updateReadingSchema = z.object({
  date: z.string().datetime().optional(),
  slot: z
    .enum(["MORNING", "AFTER_BREAKFAST", "AFTER_LUNCH", "AFTER_DINNER"])
    .optional(),
  value: z
    .number()
    .int()
    .min(40, "Value must be between 40 and 600 mg/dl.")
    .max(600, "Value must be between 40 and 600 mg/dl.")
    .optional(),
});


const SLOT_LABELS: Record<string, string> = {
  MORNING: "Morning (fasting)",
  AFTER_BREAKFAST: "After breakfast",
  AFTER_LUNCH: "After lunch",
  AFTER_DINNER: "After dinner",
};

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

export const listReadings = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const dateParam = req.query.date as string | undefined;
    const targetDate = dateParam ? new Date(dateParam) : new Date();

    if (isNaN(targetDate.getTime())) {
      throw new HttpError(400, "Invalid date");
    }

    const readings = await prisma.reading.findMany({
      where: {
        userId,
        date: {
          gte: startOfDay(targetDate),
          lte: endOfDay(targetDate),
        },
      },
      orderBy: { slot: "asc" },
    });

    res.json({ success: true, readings });
  }
);

export const createReading = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const body = readingSchema.parse(req.body);
    const userId = req.user!.id;

    if (body.value === undefined) {
      throw new HttpError(400, "Please enter a glucose value.");
    }

    const readingDate = new Date(body.date);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (readingDate < now) {
      throw new HttpError(400, "Date cannot be in the future.");
    }

    const existing = await prisma.reading.findFirst({
      where: {
        userId,
        date: {
          gte: startOfDay(readingDate),
          lte: endOfDay(readingDate),
        },
        slot: body.slot,
      },
    });
    if (existing) {
      throw new HttpError(
        400,
        `You already have an ${SLOT_LABELS[body.slot]} reading for this date.`
      );
    }

    const countToday = await prisma.reading.count({
      where: {
        userId,
        date: {
          gte: startOfDay(readingDate),
          lte: endOfDay(readingDate),
        },
      },
    });
    if (countToday >= 4) {
      throw new HttpError(400, "You can add only 4 readings per day.");
    }

    const reading = await prisma.reading.create({
      data: {
        userId,
        date: readingDate,
        slot: body.slot,
        value: body.value,
      },
    });

    res.status(201).json({ success: true, reading });
  }
);

export const getReading = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string };
  const userId = req.user!.id;

  const reading = await prisma.reading.findFirst({
    where: { id, userId },
  });
  if (!reading) {
    throw new HttpError(404, "Reading not found");
  }

  res.json({ success: true, reading });
});

export const updateReading = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    const userId = req.user!.id;
    const body = updateReadingSchema.parse(req.body);

    const existing = await prisma.reading.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      throw new HttpError(404, "Reading not found");
    }

    const readingDate = body.date ? new Date(body.date) : existing.date;
    const slot = body.slot ?? existing.slot;
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (readingDate < now) {
      throw new HttpError(400, "Date cannot be in the future.");
    }

    const conflict = await prisma.reading.findFirst({
      where: {
        userId,
        date: {
          gte: startOfDay(readingDate),
          lte: endOfDay(readingDate),
        },
        slot,
        id: { not: id },
      },
    });
    if (conflict) {
      throw new HttpError(
        400,
        `You already have an ${SLOT_LABELS[slot]} reading for this date.`
      );
    }

    const countToday = await prisma.reading.count({
      where: {
        userId,
        date: {
          gte: startOfDay(readingDate),
          lte: endOfDay(readingDate),
        },
        id: { not: id },
      },
    });
    if (countToday >= 4) {
      throw new HttpError(400, "You can add only 4 readings per day.");
    }

    const reading = await prisma.reading.update({
      where: { id },
      data: {
        ...(body.date ? { date: readingDate } : {}),
        ...(body.slot ? { slot: body.slot } : {}),
        ...(body.value !== undefined ? { value: body.value } : {}),
      },
    });

    res.json({ success: true, reading });
  }
);

export const deleteReading = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params as { id: string };
    const userId = req.user!.id;

    const existing = await prisma.reading.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      throw new HttpError(404, "Reading not found");
    }

    await prisma.reading.delete({ where: { id } });

    res.json({ success: true, message: "Reading deleted" });
  }
);

