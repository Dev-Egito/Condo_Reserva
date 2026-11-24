import { api } from "./api";
import { Resident } from "../types/models";

export interface CreateResidentPayload {
  fullName: string;
  cpf: string;
  phone: string;
  apartmentId: string;
  email?: string;
  password?: string;
}

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

  async delete(id: string): Promise<void> {
    await api.delete(`/residents/${id}`);
  },
};
