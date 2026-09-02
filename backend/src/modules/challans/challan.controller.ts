import { Request, Response, NextFunction } from "express";
import {
  createChallan,
  getChallanById,
  listChallans,
  confirmChallan,
  cancelChallan,
} from "./challan.service";
import { streamChallanPdf } from "../../utils/generateChallanPdf";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { customerId, items } = req.body;
    const challan = await createChallan({
      customerId,
      items,
      createdById: req.user!.id,
    });
    res.status(201).json({ success: true, data: challan });
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const challan = await getChallanById(req.params.id);
    res.status(200).json({ success: true, data: challan });
  } catch (err) {
    next(err);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit, status } = req.query;
    const result = await listChallans({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      status: status as string,
    });
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function confirm(req: Request, res: Response, next: NextFunction) {
  try {
    const challan = await confirmChallan(req.params.id, req.user!.id);
    res.status(200).json({ success: true, data: challan });
  } catch (err) {
    next(err);
  }
}

export async function cancel(req: Request, res: Response, next: NextFunction) {
  try {
    const challan = await cancelChallan(req.params.id);
    res.status(200).json({ success: true, data: challan });
  } catch (err) {
    next(err);
  }
}

export async function exportPdf(req: Request, res: Response, next: NextFunction) {
  try {
    const challan = await getChallanById(req.params.id);
    streamChallanPdf(res, challan as any);
  } catch (err) {
    next(err);
  }
}