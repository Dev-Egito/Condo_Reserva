import { api } from "./api";
import { Apartment } from "../types/models";

export interface CreateApartmentPayload {
  block: string;
  number: string;
}

export const apartmentService = {
  async getAll(): Promise<Apartment[]> {
    const response = await api.get<Apartment[]>("/apartments");
    return response.data;
  },

  async create(payload: CreateApartmentPayload): Promise<Apartment> {
    const response = await api.post<Apartment>("/apartments", payload);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/apartments/${id}`);
  },
};
