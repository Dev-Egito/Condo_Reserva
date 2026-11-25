import { api } from "./api";
import { Resident, Apartment } from "../types/models";

export interface CreateResidentPayload {
  fullName: string;
  cpf: string;
  phone: string;
  apartmentId: string;
  email?: string;
  password?: string;
}

export type UpdateResidentPayload = Partial<CreateResidentPayload>;

export const residentService = {
  async getAll(): Promise<Resident[]> {
    const response = await api.get<Resident[]>("/residents");
    return response.data;
  },

  async getById(id: string): Promise<Resident> {
    const response = await api.get<Resident>(`/residents/${id}`);
    return response.data;
  },

  async create(payload: CreateResidentPayload): Promise<Resident> {
    const response = await api.post<Resident>("/residents", payload);
    return response.data;
  },

  async update(id: string, payload: UpdateResidentPayload): Promise<Resident> {
    const response = await api.put<Resident>(`/residents/${id}`, payload);
    return response.data;
  },

  async register(payload: CreateResidentPayload): Promise<{ message: string; resident: Resident }> {
    const response = await api.post<{ message: string; resident: Resident }>("/auth/register", payload);
    return response.data;
  },

  async getPublicApartments(): Promise<Apartment[]> {
    const response = await api.get<Apartment[]>("/auth/apartments");
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/residents/${id}`);
  },
};
