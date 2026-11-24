export interface LeisureArea {
  id: string;
  name: string;
  description?: string | null;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Apartment {
  id: string;
  block: string;
  number: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Resident {
  id: string;
  fullName: string;
  cpf: string;
  phone: string;
  apartmentId: string;
  userId?: string | null;
  createdAt?: string;
  updatedAt?: string;
  apartment?: Apartment;
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
  resident?: {
    fullName: string;
    apartment?: {
      block: string;
      number: string;
    };
  };
  leisureArea?: {
    name: string;
  };
}
