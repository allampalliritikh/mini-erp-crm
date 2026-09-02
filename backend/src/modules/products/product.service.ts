import prisma from "../../config/db";

interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  lowStock?: boolean;
}

export async function listProducts(params: ListParams) {
  const page = params.page || 1;
  const limit = params.limit || 10;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { sku: { contains: params.search, mode: "insensitive" } },
      { category: { contains: params.search, mode: "insensitive" } },
    ];
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
    prisma.product.count({ where }),
  ]);

  const result = params.lowStock
    ? products.filter((p) => p.stock <= p.minStock)
    : products;

  return {
    products: result,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    throw { status: 404, message: "Product not found" };
  }
  return product;
}

export async function createProduct(data: any) {
  const existing = await prisma.product.findUnique({ where: { sku: data.sku } });
  if (existing) {
    throw { status: 400, message: "SKU already exists" };
  }
  return prisma.product.create({ data });
}

export async function updateProduct(id: string, data: any) {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    throw { status: 404, message: "Product not found" };
  }
  return prisma.product.update({ where: { id }, data });
}