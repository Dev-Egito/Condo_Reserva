import { api } from "./api";
import { Reservation, CreateReservationPayload } from "../types/reservation";

export const reservationService = {
  async getMyReservations(): Promise<Reservation[]> {
    const response = await api.get<Reservation[]>("/reservations/me");
    return response.data;
  },

  async getAll(): Promise<Reservation[]> {
    const response = await api.get<Reservation[]>("/reservations");
    return response.data;
  },

  async create(payload: CreateReservationPayload): Promise<Reservation> {
    const response = await api.post<Reservation>("/reservations", payload);
    return response.data;
  },

  async cancel(id: string): Promise<Reservation> {
    const response = await api.patch<Reservation>(`/reservations/${id}/cancel`);
    return response.data;
  },
};
