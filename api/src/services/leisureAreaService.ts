import {
  leisureAreaRepository,
  type CreateLeisureAreaData,
  type UpdateLeisureAreaData,
} from "../repositories/leisureAreaRepository";
import { AppError } from "../utils/appError";

export const leisureAreaService = {
  async create(data: CreateLeisureAreaData) {
    const name = data.name.trim();

    return leisureAreaRepository.create({
      ...data,
      name,
      description: data.description?.trim() || null,
    });
  },

  async findAll() {
    return leisureAreaRepository.findAll();
  },

  async findById(id: string) {
    const area = await leisureAreaRepository.findById(id);

    if (!area) {
      throw new AppError("Área de lazer não encontrada.", 404);
    }

    return area;
  },

  async update(id: string, data: UpdateLeisureAreaData) {
    await this.findById(id);

    const updatedData: UpdateLeisureAreaData = { ...data };

    if (updatedData.name !== undefined) {
      updatedData.name = updatedData.name.trim();
    }

    if (updatedData.description !== undefined) {
      updatedData.description = updatedData.description?.trim() || null;
    }

    return leisureAreaRepository.update(id, updatedData);
  },

  async delete(id: string) {
    await this.findById(id);

    return leisureAreaRepository.delete(id);
  },
};