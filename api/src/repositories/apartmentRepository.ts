import { prisma } from "../database/prisma";

export interface CreateApartmentData {
  block: string;
  number: string;
}

export type UpdateApartmentData = Partial<CreateApartmentData>;

export const apartmentRepository = {
  create(data: CreateApartmentData) {
    return prisma.apartment.create({
      data,
    });
  },

  findAll() {
    return prisma.apartment.findMany({
      orderBy: [
        { block: "asc" },
        { number: "asc" },
      ],
    });
  },

  findById(id: string) {
    return prisma.apartment.findUnique({
      where: { id },
    });
  },

  findByBlockAndNumber(block: string, number: string) {
    return prisma.apartment.findUnique({
      where: {
        block_number: {
          block,
          number,
        },
      },
    });
  },

  update(id: string, data: UpdateApartmentData) {
    return prisma.apartment.update({
      where: { id },
      data,
    });
  },

  delete(id: string) {
    return prisma.apartment.delete({
      where: { id },
    });
  },
}