import { prisma } from "../database/prisma";

export interface CreateResidentData {
  fullName: string;
  cpf: string;
  phone: string;
  block: string;
  apartment: string;
}

export type UpdateResidentData = Partial<CreateResidentData>;

export const residentRepository = {
  create(data: CreateResidentData) {
    return prisma.resident.create({
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
