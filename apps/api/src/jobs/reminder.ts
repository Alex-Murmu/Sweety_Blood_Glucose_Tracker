import { Queue, Worker } from "bullmq";
import { prisma } from "../utils/prisma.js";
import { config } from "../config/config.js";

const connection = config.redisUrl
  ? { url: config.redisUrl, maxRetriesPerRequest: null as null }
  : null;

export const reminderQueue = connection
  ? new Queue("daily-reading-reminders", { connection })
  : null;

export async function runDailyReminderCheck() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setHours(23, 59, 59, 999);

  const patients = await prisma.user.findMany({
    where: { role: "PATIENT" },
    select: {
      id: true,
      name: true,
      email: true,
      readings: {
        where: { date: { gte: start, lte: end } },
        select: { id: true, slot: true, value: true },
      },
    },
    orderBy: { name: "asc" },
  });

  const reminders = patients
    .filter((patient) => patient.readings.length < 4)
    .map((patient) => ({
      id: patient.id,
      name: patient.name,
      email: patient.email,
      readingsCount: patient.readings.length,
      missingSlotsCount: 4 - patient.readings.length,
    }));

  console.log(
    `[Reminder] ${reminders.length} of ${patients.length} patients have fewer than 4 readings today.`
  );

  return {
    checkedAt: new Date().toISOString(),
    totalPatients: patients.length,
    remindedCount: reminders.length,
    patientsNeedingReadings: reminders,
  };
}

if (connection) {
  new Worker(
    "daily-reading-reminders",
    async () => {
      return await runDailyReminderCheck();
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
