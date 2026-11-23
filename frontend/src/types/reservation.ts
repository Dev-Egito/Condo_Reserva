import { LeisureArea } from "./leisureArea";

export interface Apartment {
  id: string;
  block: string;
  number: string;
}

export interface Resident {
  id: string;
  fullName: string;
  cpf: string;
  phone: string;
  apartment?: Apartment | null;
}

export type ReservationStatus = "CONFIRMED" | "CANCELLED";

export interface Reservation {
  id: string;
  residentId: string;
  leisureAreaId: string;
  startAt: string;
  endAt: string;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
  leisureArea?: LeisureArea;
  resident?: Resident;
}

export interface CreateReservationPayload {
  leisureAreaId: string;
  startAt: string; // ISO string
  endAt: string;   // ISO string
  residentId?: string;
}
