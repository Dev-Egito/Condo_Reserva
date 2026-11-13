import { Request, Response, NextFunction } from "express";
import { reservationService } from "../services/reservationService";
import type {
  CreateReservationData,
  UpdateReservationData,
} from "../repositories/reservationRepository";

export const reservationController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
        const data = {
        ...req.body,
        startAt: new Date(req.body.startAt),
        endAt: new Date(req.body.endAt),
        };

        const reservation = await reservationService.create(data);

        return res.status(201).json(reservation);
    } catch (error) {
        return next(error);
    }
  },

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const reservations = await reservationService.findAll();

      return res.status(200).json(reservations);
    } catch (error) {
      return next(error);
    }
  },

  async findById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      const reservation = await reservationService.findById(id);

      return res.status(200).json(reservation);
    } catch (error) {
      return next(error);
    }
  },

  async update(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
        const { id } = req.params;

        const data = {
        ...req.body,
        ...(req.body.startAt !== undefined && {
            startAt: new Date(req.body.startAt),
        }),
        ...(req.body.endAt !== undefined && {
            endAt: new Date(req.body.endAt),
        }),
        };

        const reservation = await reservationService.update(id, data);

        return res.status(200).json(reservation);
    } catch (error) {
        return next(error);
    }
  },

  async cancel(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      const reservation = await reservationService.cancel(id);

      return res.status(200).json(reservation);
    } catch (error) {
      return next(error);
    }
  },
};
