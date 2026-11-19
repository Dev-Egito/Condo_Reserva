import { prisma } from "../database/prisma";
import { ReservationStatus } from "../generated/prisma/client";

export interface CreateReservationData {
  residentId: string;
  leisureAreaId: string;
  startAt: Date;
  endAt: Date;
}

export type UpdateReservationData = Partial<CreateReservationData>;

export const reservationRepository = {
  create(data: CreateReservationData) {
    return prisma.reservation.create({
      data,
    });
  },

  findAll() {
    return prisma.reservation.findMany({
      orderBy: {
        startAt: "asc",
      },
    });
  },

  findById(id: string) {
    return prisma.reservation.findUnique({
      where: { id },
    });
  },

  findConfirmedConflict(
    leisureAreaId: string,
    startAt: Date,
    endAt: Date,
    excludeId?: string
  ) {
    return prisma.reservation.findFirst({
      where: {
        leisureAreaId,
        status: ReservationStatus.CONFIRMED,
        startAt: {
          lt: endAt,
        },
        endAt: {
          gt: startAt,
        },
        ...(excludeId && {
          id: {
            not: excludeId,
          },
        }),
      },
    });
  },

  update(id: string, data: UpdateReservationData) {
    return prisma.reservation.update({
      where: { id },
      data,
    });
  },

  cancel(id: string) {
    return prisma.reservation.update({
      where: { id },
      data: {
        status: ReservationStatus.CANCELLED,
      },
    });
  },
};