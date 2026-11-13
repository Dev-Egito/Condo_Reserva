import { ReservationStatus } from "../generated/prisma/client";
import { AppError } from "../utils/appError";
import { residentRepository } from "../repositories/residentRepository";
import { leisureAreaRepository } from "../repositories/leisureAreaRepository";
import {
  reservationRepository,
  type CreateReservationData,
  type UpdateReservationData,
} from "../repositories/reservationRepository";

function validatePeriod(startAt: Date, endAt: Date) {
  if (
    Number.isNaN(startAt.getTime()) ||
    Number.isNaN(endAt.getTime())
  ) {
    throw new AppError("Informe datas válidas para a reserva.", 400);
  }

  if (startAt >= endAt) {
    throw new AppError(
      "A data inicial deve ser anterior à data final.",
      400
    );
  }
}

export const reservationService = {
  async create(data: CreateReservationData) {
    if (!data.residentId?.trim()) {
      throw new AppError("O morador é obrigatório.", 400);
    }

    if (!data.leisureAreaId?.trim()) {
      throw new AppError("A área de lazer é obrigatória.", 400);
    }

    validatePeriod(data.startAt, data.endAt);

    const resident = await residentRepository.findById(data.residentId);

    if (!resident) {
      throw new AppError("Morador não encontrado.", 404);
    }

    const leisureArea = await leisureAreaRepository.findById(
      data.leisureAreaId
    );

    if (!leisureArea) {
      throw new AppError("Área de lazer não encontrada.", 404);
    }

    if (!leisureArea.active) {
      throw new AppError("Esta área de lazer está inativa.", 400);
    }

    const conflict = await reservationRepository.findConfirmedConflict(
      data.leisureAreaId,
      data.startAt,
      data.endAt
    );

    if (conflict) {
      throw new AppError(
        "Já existe uma reserva para esta área nesse horário.",
        409
      );
    }

    return reservationRepository.create(data);
  },

  findAll() {
    return reservationRepository.findAll();
  },

  async findById(id: string) {
    const reservation = await reservationRepository.findById(id);

    if (!reservation) {
      throw new AppError("Reserva não encontrada.", 404);
    }

    return reservation;
  },

  async update(id: string, data: UpdateReservationData) {
    const reservation = await this.findById(id);

    if (reservation.status === ReservationStatus.CANCELLED) {
      throw new AppError(
        "Não é possível atualizar uma reserva cancelada.",
        400
      );
    }

    if (Object.keys(data).length === 0) {
      throw new AppError(
        "Informe pelo menos um campo para atualizar.",
        400
      );
    }

    if (data.residentId !== undefined) {
      if (!data.residentId.trim()) {
        throw new AppError("O morador é obrigatório.", 400);
      }

      const resident = await residentRepository.findById(data.residentId);

      if (!resident) {
        throw new AppError("Morador não encontrado.", 404);
      }
    }

    const leisureAreaId = data.leisureAreaId ?? reservation.leisureAreaId;

    if (data.leisureAreaId !== undefined && !data.leisureAreaId.trim()) {
      throw new AppError("A área de lazer é obrigatória.", 400);
    }

    const leisureArea = await leisureAreaRepository.findById(leisureAreaId);

    if (!leisureArea) {
      throw new AppError("Área de lazer não encontrada.", 404);
    }

    if (!leisureArea.active) {
      throw new AppError("Esta área de lazer está inativa.", 400);
    }

    const startAt = data.startAt ?? reservation.startAt;
    const endAt = data.endAt ?? reservation.endAt;

    validatePeriod(startAt, endAt);

    const conflict = await reservationRepository.findConfirmedConflict(
      leisureAreaId,
      startAt,
      endAt,
      id
    );

    if (conflict) {
      throw new AppError(
        "Já existe uma reserva para esta área nesse horário.",
        409
      );
    }

    return reservationRepository.update(id, data);
  },

  async cancel(id: string) {
    const reservation = await this.findById(id);

    if (reservation.status === ReservationStatus.CANCELLED) {
      throw new AppError("Esta reserva já foi cancelada.", 400);
    }

    return reservationRepository.cancel(id);
  },
};