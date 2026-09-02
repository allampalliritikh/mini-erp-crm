import { Request, Response, NextFunction } from "express";
import { listProducts, getProductById, createProduct, updateProduct } from "./product.service";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit, search, lowStock } = req.query;
    const result = await listProducts({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search: search as string,
      lowStock: lowStock === "true",
    });
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await getProductById(req.params.id);
    res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await createProduct(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await updateProduct(req.params.id, req.body);
    res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
}