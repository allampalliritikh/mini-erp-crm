import prisma from "../../config/db";

export async function listStockLogs(productId?: string) {
  return prisma.stockLog.findMany({
    where: productId ? { productId } : undefined,
    include: { product: true, createdBy: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function adjustStock(params: {
  productId: string;
  quantity: number;
  movementType: "IN" | "OUT";
  reason?: string;
  createdById: string;
}) {
  const { productId, quantity, movementType, reason, createdById } = params;

  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw { status: 404, message: "Product not found" };
    }

    const newStock =
      movementType === "IN" ? product.stock + quantity : product.stock - quantity;

    if (newStock < 0) {
      throw { status: 400, message: `Insufficient stock for ${product.name}` };
    }

    const updatedProduct = await tx.product.update({
      where: { id: productId },
      data: { stock: newStock },
    });

    const log = await tx.stockLog.create({
      data: { productId, quantity, movementType, reason, createdById },
    });

    return { product: updatedProduct, log };
  });
}