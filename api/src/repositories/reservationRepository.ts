import { prisma } from "../database/prisma";
import { ReservationStatus } from "../generated/prisma/client";

export interface CreateReservationData {
  residentId: string;
  leisureAreaId: string;
  startAt: Date;
  endAt: Date;
}

export type UpdateReservationData = Partial<CreateReservationData>;

const reservationInclude = {
  resident: {
    select: {
      fullName: true,
      apartment: {
        select: {
          block: true,
          number: true,
        },
      },
    },
  },
  leisureArea: {
    select: {
      name: true,
    },
  },
} as const;

export const reservationRepository = {
  create(data: CreateReservationData) {
    return prisma.reservation.create({
      data,
      include: reservationInclude,
    });
  },

  findAll() {
    return prisma.reservation.findMany({
      include: reservationInclude,
      orderBy: {
        startAt: "asc",
      },
    });
  },

  findByResidentId(residentId: string) {
    return prisma.reservation.findMany({
      where: { residentId },
      include: reservationInclude,
      orderBy: {
        startAt: "desc",
      },
    });
  },

  findById(id: string) {
    return prisma.reservation.findUnique({
      where: { id },
      include: reservationInclude,
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
      include: reservationInclude,
    });
  },

  cancel(id: string) {
    return prisma.reservation.update({
      where: { id },
      data: {
        status: ReservationStatus.CANCELLED,
      },
      include: reservationInclude,
    });
  },

  delete(id: string) {
    return prisma.reservation.delete({
      where: { id },
    });
  },
};