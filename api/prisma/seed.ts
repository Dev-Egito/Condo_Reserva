import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  Role,
  ReservationStatus,
} from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL não foi definida.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const ids = {
  apartment1: "11111111-1111-4111-8111-111111111111",
  apartment2: "22222222-2222-4222-8222-222222222222",
  resident1: "33333333-3333-4333-8333-333333333333",
  resident2: "44444444-4444-4444-8444-444444444444",
  leisureArea1: "55555555-5555-4555-8555-555555555555",
  leisureArea2: "66666666-6666-4666-8666-666666666666",
  reservation1: "77777777-7777-4777-8777-777777777777",
  reservation2: "88888888-8888-4888-8888-888888888888",
};

async function main() {
  const name = process.env.ADMIN_NAME;
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !password) {
    throw new Error(
      "Configure ADMIN_NAME, ADMIN_EMAIL e ADMIN_PASSWORD no .env."
    );
  }

  if (password.length < 8) {
    throw new Error(
      "A senha do administrador deve ter pelo menos 8 caracteres."
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  // Administrador
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name,
      email,
      passwordHash,
      role: Role.ADMIN,
    },
  });

  // Apartamentos
  await prisma.apartment.upsert({
    where: { id: ids.apartment1 },
    update: {},
    create: {
      id: ids.apartment1,
      block: "A",
      number: "101",
    },
  });

  await prisma.apartment.upsert({
    where: { id: ids.apartment2 },
    update: {},
    create: {
      id: ids.apartment2,
      block: "B",
      number: "202",
    },
  });

  // Moradores
  await prisma.resident.upsert({
    where: { id: ids.resident1 },
    update: {},
    create: {
      id: ids.resident1,
      fullName: "João da Silva",
      cpf: "11111111111",
      phone: "83999990001",
      apartmentId: ids.apartment1,
    },
  });

  await prisma.resident.upsert({
    where: { id: ids.resident2 },
    update: {},
    create: {
      id: ids.resident2,
      fullName: "Maria Oliveira",
      cpf: "22222222222",
      phone: "83999990002",
      apartmentId: ids.apartment2,
    },
  });

  // Áreas de lazer
  await prisma.leisureArea.upsert({
    where: { id: ids.leisureArea1 },
    update: {},
    create: {
      id: ids.leisureArea1,
      name: "Piscina",
      description: "Área de lazer com piscina.",
      active: true,
    },
  });

  await prisma.leisureArea.upsert({
    where: { id: ids.leisureArea2 },
    update: {},
    create: {
      id: ids.leisureArea2,
      name: "Salão de festas",
      description: "Espaço para eventos e confraternizações.",
      active: true,
    },
  });

  // Datas futuras para as reservas de demonstração
  const startAt1 = new Date();
  startAt1.setDate(startAt1.getDate() + 1);
  startAt1.setHours(10, 0, 0, 0);

  const endAt1 = new Date(startAt1);
  endAt1.setHours(12, 0, 0, 0);

  const startAt2 = new Date();
  startAt2.setDate(startAt2.getDate() + 2);
  startAt2.setHours(14, 0, 0, 0);

  const endAt2 = new Date(startAt2);
  endAt2.setHours(16, 0, 0, 0);

  // Reservas
  await prisma.reservation.upsert({
    where: { id: ids.reservation1 },
    update: {},
    create: {
      id: ids.reservation1,
      residentId: ids.resident1,
      leisureAreaId: ids.leisureArea1,
      startAt: startAt1,
      endAt: endAt1,
      status: ReservationStatus.CONFIRMED,
    },
  });

  await prisma.reservation.upsert({
    where: { id: ids.reservation2 },
    update: {},
    create: {
      id: ids.reservation2,
      residentId: ids.resident2,
      leisureAreaId: ids.leisureArea2,
      startAt: startAt2,
      endAt: endAt2,
      status: ReservationStatus.CONFIRMED,
    },
  });

  console.log("Seed executado com sucesso!");
  console.log("Administrador verificado/criado.");
  console.log("Apartamentos, moradores, áreas e reservas verificados/criados.");
}

main()
  .catch((error) => {
    console.error("Erro ao executar seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });