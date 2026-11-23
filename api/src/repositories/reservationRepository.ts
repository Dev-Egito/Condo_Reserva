import { prisma } from "../database/prisma";
import { ReservationStatus } from "../generated/prisma/client";

export interface CreateReservationData {
  residentId: string;
  leisureAreaId: string;
  startAt: Date;
  endAt: Date;
}

export type UpdateReservationData = Partial<CreateReservationData>;

const reservationIncludes = {
  leisureArea: true,
  resident: {
    include: {
      apartment: true,
    },
  },
};

export const reservationRepository = {
  create(data: CreateReservationData) {
    return prisma.reservation.create({
      data,
      include: reservationIncludes,
    });
  },

  findAll() {
    return prisma.reservation.findMany({
      include: reservationIncludes,
      orderBy: {
        startAt: "asc",
      },
    });
  },

  findByResidentId(residentId: string) {
    return prisma.reservation.findMany({
      where: { residentId },
      include: reservationIncludes,
      orderBy: {
        startAt: "desc",
      },
    });
  },

  findById(id: string) {
    return prisma.reservation.findUnique({
      where: { id },
      include: reservationIncludes,
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
      include: reservationIncludes,
    });
  },

  cancel(id: string) {
    return prisma.reservation.update({
      where: { id },
      data: {
        status: ReservationStatus.CANCELLED,
      },
      include: reservationIncludes,
    });
  },
};