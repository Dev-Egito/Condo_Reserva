import { Prisma, PrismaClient } from "../generated/prisma/client";
import { prisma } from "../database/prisma";

type PrismaExecutor = PrismaClient | Prisma.TransactionClient;

export interface CreateResidentData {
  fullName: string;
  cpf: string;
  phone: string;
  block: string;
  apartment: string;
}

export type UpdateResidentData = Partial<CreateResidentData>;

export const residentRepository = {
  create(
    data: CreateResidentData & { userId?: string },
    client: PrismaExecutor = prisma
  ) {
    return client.resident.create({
      data,
    });
  },

  findAll() {
    return prisma.resident.findMany({
      orderBy: {
        fullName: "asc",
      },
    });
  },

  findById(id: string) {
    return prisma.resident.findUnique({
      where: { id },
    });
  },

  findByUserId(userId: string) {
    return prisma.resident.findUnique({
      where: { userId },
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
    });
  },

  delete(id: string) {
    return prisma.resident.delete({
      where: { id },
    });
  },
};
