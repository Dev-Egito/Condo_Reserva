import { Prisma, PrismaClient } from "../generated/prisma/client";
import { prisma } from "../database/prisma";

type PrismaExecutor = PrismaClient | Prisma.TransactionClient;

export const userRepository = {
  create(
    data: Prisma.UserCreateInput,
    client: PrismaExecutor = prisma
  ) {
    return client.user.create({
      data,
    });
  },

  findByEmail(email: string, client: PrismaExecutor = prisma) {
    return client.user.findUnique({
      where: { email },
    });
  },

  findById(id: string, client: PrismaExecutor = prisma) {
    return client.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  findByIdWithPassword(id: string) {
    return prisma.user.findUnique({
        where: { id },
    });
  },

  updatePassword(
    id: string,
    passwordHash: string,
    client: PrismaExecutor = prisma
  ) {
    return client.user.update({
      where: { id },
      data: { passwordHash },
    });
  },

  delete(id: string, client: PrismaExecutor = prisma) {
    return client.user.delete({
      where: { id },
    });
  },
};
