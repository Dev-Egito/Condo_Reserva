import { Prisma, PrismaClient } from "../generated/prisma/client";
import { prisma } from "../database/prisma";

type PrismaExecutor = PrismaClient | Prisma.TransactionClient;

export interface CreateResidentData {
  fullName: string;
  cpf: string;
  phone: string;
  apartmentId: string;
}

export type UpdateResidentData = Partial<CreateResidentData>;

export const residentRepository = {
  create(
    data: CreateResidentData & { userId?: string },
    client: PrismaExecutor = prisma
  ) {
    return client.resident.create({
      data,
      include: {
        apartment: true,
      },
    });
  },

  findAll() {
    return prisma.resident.findMany({
      orderBy: {
        fullName: "asc",
      },
      include: {
        apartment: true,
      },
    });
  },

  findById(id: string) {
    return prisma.resident.findUnique({
      where: { id },
      include: {
        apartment: true,
      },
    });
  },

  findByUserId(userId: string) {
    return prisma.resident.findUnique({
      where: { userId },
      include: {
        apartment: true,
      },
    });
  },

  findByCpf(cpf: string) {
    return prisma.resident.findUnique({
      where: { cpf },
    });
  },

  update(id: string, data: UpdateResidentData) {
    return prisma.resident.update({
      where: { id },
      data,
      include: {
        apartment: true,
      },
    });
  },

  delete(id: string) {
    return prisma.resident.delete({
      where: { id },
    });
  },
};