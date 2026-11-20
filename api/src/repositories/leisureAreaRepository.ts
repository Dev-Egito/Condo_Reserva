import { prisma } from "../database/prisma";

export interface CreateLeisureAreaData {
  name: string;
  description?: string | null;
  active?: boolean;
}

export type UpdateLeisureAreaData =
  Partial<CreateLeisureAreaData>;

export const leisureAreaRepository = {
  create(data: CreateLeisureAreaData) {
    return prisma.leisureArea.create({
      data,
    });
  },

  findAll() {
    return prisma.leisureArea.findMany({
      orderBy: {
        name: "asc",
      },
    });
  },

  findById(id: string) {
    return prisma.leisureArea.findUnique({
      where: { id },
    });
  },

  update(id: string, data: UpdateLeisureAreaData) {
    return prisma.leisureArea.update({
      where: { id },
      data,
    });
  },

  delete(id: string) {
    return prisma.leisureArea.delete({
      where: { id },
    });
  },
};
