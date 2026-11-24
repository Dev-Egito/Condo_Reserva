import { ReservationStatus, Role } from "../generated/prisma/client";
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

  if (startAt < new Date()) {
    throw new AppError(
      "A data inicial da reserva não pode estar no passado.",
      400
    );
  }

  if (startAt >= endAt) {
    throw new AppError(
      "A data inicial deve ser anterior à data final.",
      400
    );
  }
}

async function validateReservationAccess(
  reservation: { residentId: string },
  authenticatedUser: { id: string; role: Role }
) {
  if (authenticatedUser.role === Role.ADMIN) {
    return;
  }

  const resident = await residentRepository.findByUserId(
    authenticatedUser.id
  );

  if (!resident) {
    throw new AppError("Cadastro de morador não encontrado.", 404);
  }

  if (reservation.residentId !== resident.id) {
    throw new AppError(
      "Você não tem permissão para acessar esta reserva.",
      403
    );
  }
}

export const reservationService = {
  async create(
    data: CreateReservationData,
    authenticatedUser: { id: string; role: Role }
  ) {
    let residentId = data.residentId;

    if (authenticatedUser.role === Role.RESIDENT) {
      const resident = await residentRepository.findByUserId(
        authenticatedUser.id
      );

      if (!resident) {
        throw new AppError("Cadastro de morador não encontrado.", 404);
      }

      residentId = resident.id;
    }

    if (!residentId) {
      throw new AppError("O morador é obrigatório.", 400);
    }

    validatePeriod(data.startAt, data.endAt);

    const resident = await residentRepository.findById(residentId);

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

    return reservationRepository.create({
      ...data,
      residentId,
    });
  },

  findAll() {
    return reservationRepository.findAll();
  },

  async findMyReservations(authenticatedUser: { id: string; role: Role }) {
    if (authenticatedUser.role === Role.ADMIN) {
      return reservationRepository.findAll();
    }

    const resident = await residentRepository.findByUserId(
      authenticatedUser.id
    );

    if (!resident) {
      throw new AppError("Cadastro de morador não encontrado.", 404);
    }

    return reservationRepository.findByResidentId(resident.id);
  },

  async findById(
    id: string,
    authenticatedUser: { id: string; role: Role }
  ) {
    const reservation = await reservationRepository.findById(id);

    if (!reservation) {
      throw new AppError("Reserva não encontrada.", 404);
    }

    await validateReservationAccess(reservation, authenticatedUser);

    return reservation;
  },

  async update(id: string, data: UpdateReservationData) {
    const reservation = await reservationRepository.findById(id);

    if (!reservation) {
      throw new AppError("Reserva não encontrada.", 404);
    }

    if (reservation.status === ReservationStatus.CANCELLED) {
      throw new AppError(
        "Não é possível atualizar uma reserva cancelada.",
        400
      );
    }

    if (data.residentId !== undefined) {
      const resident = await residentRepository.findById(data.residentId);

      if (!resident) {
        throw new AppError("Morador não encontrado.", 404);
      }
    }

    const leisureAreaId = data.leisureAreaId ?? reservation.leisureAreaId;

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

  async cancel(
    id: string,
    authenticatedUser: { id: string; role: Role }
  ) {
    const reservation = await this.findById(id, authenticatedUser);

    if (reservation.status === ReservationStatus.CANCELLED) {
      throw new AppError("Esta reserva já foi cancelada.", 400);
    }

    return reservationRepository.cancel(id);
  },

  async delete(id: string) {
    const reservation = await reservationRepository.findById(id);

    if (!reservation) {
      throw new AppError("Reserva não encontrada.", 404);
    }

    return reservationRepository.delete(id);
  },
};