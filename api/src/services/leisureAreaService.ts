import {
  leisureAreaRepository,
  CreateLeisureAreaData,
  UpdateLeisureAreaData,
} from "../repositories/leisureAreaRepository";

import { AppError } from "../utils/appError";

export const leisureAreaService = {
  async create(data: CreateLeisureAreaData) {
    const name = data.name?.trim();

    if (!name) {
      throw new AppError("O nome da área é obrigatório.", 400);
    }

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

    if (Object.keys(data).length === 0) {
      throw new AppError("Informe ao menos um campo para atualizar.", 400);
    }

    if (data.name !== undefined) {
      const name = data.name.trim();

      if (!name) {
        throw new AppError("O nome da área não pode ser vazio.", 400);
      }

      data.name = name;
    }

    if (data.description !== undefined) {
      data.description = data.description?.trim() || null;
    }

    return leisureAreaRepository.update(id, data);
  },

  async delete(id: string) {
    await this.findById(id);

    return leisureAreaRepository.delete(id);
  },
};
