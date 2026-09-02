import { Request, Response, NextFunction } from "express";
import { listStockLogs, adjustStock } from "./stock.service";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const { productId } = req.query;
    const logs = await listStockLogs(productId as string);
    res.status(200).json({ success: true, data: logs });
  } catch (err) {
    next(err);
  }
}

export async function adjust(req: Request, res: Response, next: NextFunction) {
  try {
    const { productId, quantity, movementType, reason } = req.body;

    if (!productId || !quantity || !movementType) {
      return res.status(400).json({
        success: false,
        message: "productId, quantity, and movementType are required",
      });
    }

    const result = await adjustStock({
      productId,
      quantity,
      movementType,
      reason,
      createdById: req.user!.id,
    });

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}