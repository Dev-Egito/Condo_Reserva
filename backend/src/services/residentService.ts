import { AppError } from "../utils/appError";
import {
  residentRepository,
  type CreateResidentData,
  type UpdateResidentData,
} from "../repositories/residentRepository";

function validateFields(data: CreateResidentData) {
  const requiredFields = [
    "fullName",
    "cpf",
    "phone",
    "block",
    "apartment",
  ] as const;

  for (const field of requiredFields) {
    if (
      typeof data[field] !== "string" ||
      !data[field].trim()
    ) {
      throw new AppError(`O campo ${field} é obrigatório.`, 400);
    }
  }
}

export const residentService = {
  async create(data: CreateResidentData) {
    validateFields(data);

    const cpf = data.cpf.trim();

    const existingResident = await residentRepository.findByCpf(cpf);

    if (existingResident) {
      throw new AppError("CPF já cadastrado.", 409);
    }

    return residentRepository.create({
      fullName: data.fullName.trim(),
      cpf,
      phone: data.phone.trim(),
      block: data.block.trim(),
      apartment: data.apartment.trim(),
    });
  },

  async findAll() {
    return residentRepository.findAll();
  },

  async findById(id: string) {
    const resident = await residentRepository.findById(id);

    if (!resident) {
      throw new AppError("Morador não encontrado.", 404);
    }

    return resident;
  },

  async update(id: string, data: UpdateResidentData) {
    const resident = await residentRepository.findById(id);

    if (!resident) {
      throw new AppError("Morador não encontrado.", 404);
    }

    if (Object.keys(data).length === 0) {
      throw new AppError(
        "Informe pelo menos um campo para atualizar.",
        400
      );
    }

    const allowedFields = [
      "fullName",
      "cpf",
      "phone",
      "block",
      "apartment",
    ] as const;

    for (const [field, value] of Object.entries(data)) {
      if (
        !allowedFields.includes(field as typeof allowedFields[number]) ||
        typeof value !== "string" ||
        !value.trim()
      ) {
        throw new AppError(`Valor inválido para o campo ${field}.`, 400);
      }
    }

    if (data.cpf) {
      const cpf = data.cpf.trim();

      if (cpf !== resident.cpf) {
        const existingResident = await residentRepository.findByCpf(cpf);

        if (existingResident) {
          throw new AppError("CPF já cadastrado.", 409);
        }
      }
    }

    const updatedData: UpdateResidentData = {};

    for (const field of allowedFields) {
      const value = data[field];

      if (value !== undefined) {
        updatedData[field] = value.trim();
      }
    }

    return residentRepository.update(id, updatedData);
  },

  async delete(id: string) {
    const resident = await residentRepository.findById(id);

    if (!resident) {
      throw new AppError("Morador não encontrado.", 404);
    }

    return residentRepository.delete(id);
  },
};
