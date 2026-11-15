import { Queue, Worker } from "bullmq";
import { prisma } from "../utils/prisma.js";
import { config } from "../config/config.js";

const connection = config.redisUrl
  ? { url: config.redisUrl, maxRetriesPerRequest: null as null }
  : null;

export const reminderQueue = connection
  ? new Queue("daily-reading-reminders", { connection })
  : null;

if (connection) {
  new Worker(
    "daily-reading-reminders",
    async () => {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setHours(23, 59, 59, 999);
      const patients = await prisma.user.findMany({
        where: { role: "PATIENT" },
        select: { id: true, email: true, readings: { where: { date: { gte: start, lte: end } } } },
      });
      const reminders = patients.filter((patient) => patient.readings.length < 4);
      console.log(`[Reminder] ${reminders.length} patients have fewer than 4 readings today.`);
      return reminders.length;
    },
    { connection }
  );
}

export async function scheduleDailyReminder(): Promise<void> {
  if (!reminderQueue) {
    console.warn("[Reminder] REDIS_URL is not configured; daily reminder job is disabled.");
    return;
  }
  await reminderQueue.add("check-patients", {}, { repeat: { pattern: "0 9 * * *" } });
}
