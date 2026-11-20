import bcrypt from "bcrypt";
import { prisma } from "../database/prisma";
import { userRepository } from "../repositories/userRepository";
import { apartmentRepository } from "../repositories/apartmentRepository";
import { AppError } from "../utils/appError";
import { Prisma } from "../generated/prisma/client";
import {
  residentRepository,
  type CreateResidentData,
  type UpdateResidentData,
} from "../repositories/residentRepository";

interface CreateResidentWithUserData extends CreateResidentData {
  email: string;
  password: string;
}

function validateFields(data: CreateResidentData) {
  const requiredFields = [
    "fullName",
    "cpf",
    "phone",
    "apartmentId",
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
  async create(data: CreateResidentWithUserData) {
    validateFields(data);

    if (
      typeof data.email !== "string" ||
      !data.email.trim()
    ) {
      throw new AppError("O e-mail é obrigatório.", 400);
    }

    if (
      typeof data.password !== "string" ||
      data.password.length < 8
    ) {
      throw new AppError(
        "A senha deve possuir pelo menos 8 caracteres.",
        400
      );
    }

    const cpf = data.cpf.trim();
    const email = data.email.trim().toLowerCase();
    const apartmentId = data.apartmentId.trim();

    const existingResident = await residentRepository.findByCpf(cpf);

    if (existingResident) {
      throw new AppError("CPF já cadastrado.", 409);
    }

    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
      throw new AppError("E-mail já cadastrado.", 409);
    }

    const apartment = await apartmentRepository.findById(apartmentId);

    if (!apartment) {
      throw new AppError("Apartamento não encontrado.", 404);
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    try {
      return await prisma.$transaction(async (tx) => {
        const user = await userRepository.create(
          {
            name: data.fullName.trim(),
            email,
            passwordHash,
            role: "RESIDENT",
          },
          tx
        );

        const resident = await residentRepository.create(
          {
            fullName: data.fullName.trim(),
            cpf,
            phone: data.phone.trim(),
            apartmentId,
            userId: user.id,
          },
          tx
        );

        return resident;
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        const target = String(error.meta?.target ?? "");

        if (target.includes("cpf")) {
          throw new AppError("CPF já cadastrado.", 409);
        }

        if (target.includes("email")) {
          throw new AppError("E-mail já cadastrado.", 409);
        }

        throw new AppError("CPF ou e-mail já cadastrado.", 409);
      }

      throw error;
    }
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
      "apartmentId",
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

    if (data.apartmentId) {
      const apartment = await apartmentRepository.findById(
        data.apartmentId.trim()
      );

      if (!apartment) {
        throw new AppError("Apartamento não encontrado.", 404);
      }
    }

    const updatedData: UpdateResidentData = {};

    for (const field of allowedFields) {
      const value = data[field];

      if (value !== undefined) {
        updatedData[field] = value.trim();
      }
    }

    try {
      return await residentRepository.update(id, updatedData);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new AppError("CPF já cadastrado.", 409);
      }

      throw error;
    }
  },

  async delete(id: string) {
    const resident = await residentRepository.findById(id);

    if (!resident) {
      throw new AppError("Morador não encontrado.", 404);
    }

    return residentRepository.delete(id);
  },
};