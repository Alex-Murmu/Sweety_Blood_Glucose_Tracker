import { z } from "zod";
import { HttpError } from "../src/middlewares/errorHandler";

const readingSchema = z.object({
  date: z.string().datetime({ message: "Invalid date format" }),
  slot: z.enum(["MORNING", "AFTER_BREAKFAST", "AFTER_LUNCH", "AFTER_DINNER"]),
  value: z
    .number({ required_error: "Please enter a glucose value." })
    .int("Value must be a whole number.")
    .min(40, "Value must be between 40 and 600 mg/dl.")
    .max(600, "Value must be between 40 and 600 mg/dl."),
});

describe("Reading validation rules", () => {
  const baseDate = "2026-10-15T00:00:00.000Z";

  it("value is required", () => {
    expect(() =>
      readingSchema.parse({ date: baseDate, slot: "MORNING" })
    ).toThrow();
  });

  it("value must be between 40 and 600", () => {
    expect(() =>
      readingSchema.parse({ date: baseDate, slot: "MORNING", value: 30 })
    ).toThrow("Value must be between 40 and 600 mg/dl.");

    expect(() =>
      readingSchema.parse({ date: baseDate, slot: "MORNING", value: 700 })
    ).toThrow("Value must be between 40 and 600 mg/dl.");

    expect(() =>
      readingSchema.parse({ date: baseDate, slot: "MORNING", value: 100 })
    ).not.toThrow();
  });

  it("value must be a whole number", () => {
    expect(() =>
      readingSchema.parse({ date: baseDate, slot: "MORNING", value: 100.5 })
    ).toThrow();
  });

  it("accepts valid reading", () => {
    const result = readingSchema.parse({
      date: baseDate,
      slot: "AFTER_LUNCH",
      value: 140,
    });
    expect(result.value).toBe(140);
    expect(result.slot).toBe("AFTER_LUNCH");
  });

  it("validates future date logic correctly", () => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + 1000 * 60 * 60 * 48); // 2 days in future
    const pastDate = new Date(now.getTime() - 1000 * 60 * 60 * 48); // 2 days in past

    function checkFutureDate(date: Date) {
      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);
      if (date > endOfToday) {
        throw new HttpError(400, "Date cannot be in the future.");
      }
    }

    expect(() => checkFutureDate(futureDate)).toThrow("Date cannot be in the future.");
    expect(() => checkFutureDate(pastDate)).not.toThrow();
    expect(() => checkFutureDate(now)).not.toThrow();
  });
});

describe("HttpError status codes and messages", () => {
  it("creates error with statusCode and message", () => {
    const err = new HttpError(
      400,
      "You already have an After lunch reading for this date."
    );
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe(
      "You already have an After lunch reading for this date."
    );
    expect(err.name).toBe("HttpError");
  });

  it("formats max readings error message", () => {
    const err = new HttpError(400, "You can add only 4 readings per day.");
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe("You can add only 4 readings per day.");
  });
});
