import { Request, Response, NextFunction } from "express";
import {
  listCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  addFollowUpNote,
} from "./customer.service";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit, search, status } = req.query;
    const result = await listCustomers({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search: search as string,
      status: status as string,
    });
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const customer = await getCustomerById(req.params.id);
    res.status(200).json({ success: true, data: customer });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const customer = await createCustomer(req.body);
    res.status(201).json({ success: true, data: customer });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const customer = await updateCustomer(req.params.id, req.body);
    res.status(200).json({ success: true, data: customer });
  } catch (err) {
    next(err);
  }
}

export async function addNote(req: Request, res: Response, next: NextFunction) {
  try {
    const note = await addFollowUpNote(req.params.id, req.body.note);
    res.status(201).json({ success: true, data: note });
  } catch (err) {
    next(err);
  }
}