import { api } from "./api";
import { LeisureArea } from "../types/models";

export interface CreateLeisureAreaPayload {
  name: string;
  description?: string;
  active?: boolean;
}

export type UpdateLeisureAreaPayload = Partial<CreateLeisureAreaPayload>;

export const leisureAreaService = {
  async getAll(): Promise<LeisureArea[]> {
    const response = await api.get<LeisureArea[]>("/leisure-areas");
    return response.data;
  },

  async getById(id: string): Promise<LeisureArea> {
    const response = await api.get<LeisureArea>(`/leisure-areas/${id}`);
    return response.data;
  },

  async create(payload: CreateLeisureAreaPayload): Promise<LeisureArea> {
    const response = await api.post<LeisureArea>("/leisure-areas", payload);
    return response.data;
  },

  async update(id: string, payload: UpdateLeisureAreaPayload): Promise<LeisureArea> {
    const response = await api.put<LeisureArea>(`/leisure-areas/${id}`, payload);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/leisure-areas/${id}`);
  },
};
