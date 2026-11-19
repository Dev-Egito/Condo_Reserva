import { Request, Response, NextFunction } from "express";
import { leisureAreaService } from "../services/leisureAreaService";

export const leisureAreaController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const area = await leisureAreaService.create(req.body);

      return res.status(201).json(area);
    } catch (error) {
      next(error);
    }
  },

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const areas = await leisureAreaService.findAll();

      return res.status(200).json(areas);
    } catch (error) {
      next(error);
    }
  },

  async findById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      const area = await leisureAreaService.findById(id);

      return res.status(200).json(area);
    } catch (error) {
      next(error);
    }
  },

  async update(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      const area = await leisureAreaService.update(id, req.body);

      return res.status(200).json(area);
    } catch (error) {
      next(error);
    }
  },

  async delete(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      await leisureAreaService.delete(id);

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
