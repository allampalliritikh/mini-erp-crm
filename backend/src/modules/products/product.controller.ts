import { Request, Response, NextFunction } from "express";
import { listProducts, getProductById, createProduct, updateProduct } from "./product.service";
import { uploadToS3 } from "../../utils/s3";
import prisma from "../../config/db";
import multer from "multer";

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

export async function uploadImage(
  req: Request & { file?: Express.Multer.File },
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const productId = req.params.id;
    await getProductById(productId);

    const key = `products/${productId}-${Date.now()}-${req.file.originalname}`;
    const imageUrl = await uploadToS3(req.file.buffer, key, req.file.mimetype);

    const updated = await prisma.product.update({
      where: { id: productId },
      data: { imageUrl },
    });

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}