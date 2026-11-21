import { Prisma } from "../generated/prisma/client";
import { AppError } from "../utils/appError";
import {
  apartmentRepository,
  type CreateApartmentData,
  type UpdateApartmentData,
} from "../repositories/apartmentRepository";

export const apartmentService = {
  async create(data: CreateApartmentData) {
    const block = data.block.trim();
    const number = data.number.trim();

    const existingApartment =
      await apartmentRepository.findByBlockAndNumber(block, number);

    if (existingApartment) {
      throw new AppError(
        "Já existe um apartamento com esse bloco e número.",
        409
      );
    }

    try {
      return await apartmentRepository.create({ block, number });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new AppError(
          "Já existe um apartamento com esse bloco e número.",
          409
        );
      }

      throw error;
    }
  },

  async findAll() {
    return apartmentRepository.findAll();
  },

  async findById(id: string) {
    const apartment = await apartmentRepository.findById(id);

    if (!apartment) {
      throw new AppError("Apartamento não encontrado.", 404);
    }

    return apartment;
  },

  async update(id: string, data: UpdateApartmentData) {
    const apartment = await apartmentRepository.findById(id);

    if (!apartment) {
      throw new AppError("Apartamento não encontrado.", 404);
    }

    const allowedFields = ["block", "number"] as const;
    const updatedData: UpdateApartmentData = {};

    for (const field of allowedFields) {
      const value = data[field];

      if (value !== undefined) {
        updatedData[field] = value.trim();
      }
    }

    const newBlock = updatedData.block ?? apartment.block;
    const newNumber = updatedData.number ?? apartment.number;

    const existingApartment =
      await apartmentRepository.findByBlockAndNumber(newBlock, newNumber);

    if (existingApartment && existingApartment.id !== id) {
      throw new AppError(
        "Já existe um apartamento com esse bloco e número.",
        409
      );
    }

    try {
      return await apartmentRepository.update(id, updatedData);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new AppError(
          "Já existe um apartamento com esse bloco e número.",
          409
        );
      }

      throw error;
    }
  },

  async delete(id: string) {
    const apartment = await apartmentRepository.findById(id);

    if (!apartment) {
      throw new AppError("Apartamento não encontrado.", 404);
    }

    try {
      return await apartmentRepository.delete(id);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2003"
      ) {
        throw new AppError(
          "Não é possível excluir um apartamento que possui moradores vinculados.",
          409
        );
      }

      throw error;
    }
  },
};