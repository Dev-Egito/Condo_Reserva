import type { Request, Response } from "express";
import { apartmentService } from "../services/apartmentService";

export const apartmentController = {
  async create(req: Request, res: Response) {
    const apartment = await apartmentService.create(req.body);

    return res.status(201).json(apartment);
  },

  async findAll(req: Request, res: Response) {
    const apartments = await apartmentService.findAll();

    return res.status(200).json(apartments);
  },

  async findById(
    req: Request<{ id: string }>,
    res: Response
  ) {
    const apartment = await apartmentService.findById(req.params.id);

    return res.status(200).json(apartment);
  },

  async update(
    req: Request<{ id: string }>,
    res: Response
  ) {
    const apartment = await apartmentService.update(
      req.params.id,
      req.body
    );

    return res.status(200).json(apartment);
  },

  async delete(
    req: Request<{ id: string }>,
    res: Response
  ) {
    await apartmentService.delete(req.params.id);

    return res.status(204).send();
  },
};