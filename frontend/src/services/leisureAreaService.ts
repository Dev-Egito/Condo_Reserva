import { api } from "./api";
import { LeisureArea } from "../types/leisureArea";

export const leisureAreaService = {
  async getAll(): Promise<LeisureArea[]> {
    const response = await api.get<LeisureArea[]>("/leisure-areas");
    return response.data;
  },

  async getById(id: string): Promise<LeisureArea> {
    const response = await api.get<LeisureArea>(`/leisure-areas/${id}`);
    return response.data;
  },
};
