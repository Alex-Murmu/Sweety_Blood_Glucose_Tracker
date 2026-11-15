import { PrismaClient } from "../src/generated/prisma/client.js";
import { Slot } from "../src/generated/prisma/enums.js";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const prisma = new PrismaClient({
  adapter: new PrismaPg(new Pool({ connectionString: process.env.DATABASE_URL })),
});

async function main() {
  const passwordHash = await bcrypt.hash("Password123", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@sweety.local" },
    update: {},
    create: {
      name: "Demo Patient",
      email: "demo@sweety.local",
      password: passwordHash,
      role: "PATIENT",
    },
  });

  const doctor = await prisma.user.upsert({
    where: { email: "doctor@sweety.local" },
    update: { role: "DOCTOR" },
    create: {
      name: "Demo Doctor",
      email: "doctor@sweety.local",
      password: passwordHash,
      role: "DOCTOR",
    },
  });

  await prisma.doctorPatient.upsert({
    where: { doctorId_patientId: { doctorId: doctor.id, patientId: user.id } },
    update: {},
    create: { doctorId: doctor.id, patientId: user.id },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const readings = [
    { date: today, slot: "MORNING", value: 95 },
    { date: today, slot: "AFTER_BREAKFAST", value: 140 },
    { date: today, slot: "AFTER_LUNCH", value: 160 },
    { date: today, slot: "AFTER_DINNER", value: 130 },
  ];

  for (const r of readings) {
    await prisma.reading.upsert({
      where: {
        userId_date_slot: {
          userId: user.id,
          date: r.date,
          slot: r.slot as Slot,
        },
      },
      update: { value: r.value },
      create: {
        userId: user.id,
        date: r.date,
        slot: r.slot as Slot,
        value: r.value,
      },
    });
  }

  console.log("Seed complete: demo patient, doctor assignment, and 4 readings for today");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
