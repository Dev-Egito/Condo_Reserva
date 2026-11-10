import { Request, Response } from "express";
import { residentService } from "../services/residentService";
import { AppError } from "../utils/appError";

function getResidentId(req: Request): string {
  const { id } = req.params;

  if (typeof id !== "string" || !id.trim()) {
    throw new AppError("Identificador de morador inválido.", 400);
  }

  return id;
}

export const residentController = {
  async create(req: Request, res: Response) {
    const resident = await residentService.create(req.body);

    return res.status(201).json(resident);
  },

  async findAll(req: Request, res: Response) {
    const residents = await residentService.findAll();

    return res.status(200).json(residents);
  },

  async findById(req: Request, res: Response) {
    const id = getResidentId(req);
    const resident = await residentService.findById(id);

    return res.status(200).json(resident);
  },

  async update(req: Request, res: Response) {
    const id = getResidentId(req);
    const resident = await residentService.update(id, req.body);

    return res.status(200).json(resident);
  },

  async delete(req: Request, res: Response) {
    const id = getResidentId(req);

    await residentService.delete(id);

    return res.status(204).send();
  },
};
