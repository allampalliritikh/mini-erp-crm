import prisma from "../../config/db";
import { generateChallanNo } from "../../utils/generateChallanNo";

interface ChallanItemInput {
  productId: string;
  quantity: number;
}

export async function createChallan(params: {
  customerId: string;
  items: ChallanItemInput[];
  createdById: string;
}) {
  const { customerId, items, createdById } = params;

  const customer = await prisma.customer.findUnique({ where: { id: customerId } });
  if (!customer) {
    throw { status: 404, message: "Customer not found" };
  }

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) } },
  });

  if (products.length !== items.length) {
    throw { status: 400, message: "One or more products not found" };
  }

  const challanNumber = await generateChallanNo();
  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);

  const challan = await prisma.challan.create({
    data: {
      challanNumber,
      customerId,
      createdById,
      totalQuantity,
      status: "DRAFT",
      items: {
        create: items.map((item) => {
          const product = products.find((p) => p.id === item.productId)!;
          return {
            productId: product.id,
            productName: product.name,
            productSku: product.sku,
            unitPrice: product.unitPrice,
            quantity: item.quantity,
          };
        }),
      },
    },
    include: { items: true, customer: true },
  });

  return challan;
}

export async function getChallanById(id: string) {
  const challan = await prisma.challan.findUnique({
    where: { id },
    include: { items: true, customer: true, createdBy: { select: { id: true, name: true } } },
  });
  if (!challan) {
    throw { status: 404, message: "Challan not found" };
  }
  return challan;
}

export async function listChallans(params: { page?: number; limit?: number; status?: string }) {
  const page = params.page || 1;
  const limit = params.limit || 10;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (params.status) where.status = params.status;

  const [challans, total] = await Promise.all([
    prisma.challan.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { customer: true, items: true },
    }),
    prisma.challan.count({ where }),
  ]);

  return {
    challans,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function confirmChallan(id: string, confirmedById: string) {
  return prisma.$transaction(async (tx) => {
    const challan = await tx.challan.findUnique({ where: { id }, include: { items: true } });

    if (!challan) {
      throw { status: 404, message: "Challan not found" };
    }
    if (challan.status !== "DRAFT") {
      throw { status: 400, message: `Cannot confirm a challan with status ${challan.status}` };
    }

    for (const item of challan.items) {
      const product = await tx.product.findUnique({ where: { id: item.productId } });
      if (!product) {
        throw { status: 404, message: `Product ${item.productName} no longer exists` };
      }
      if (product.stock < item.quantity) {
        throw { status: 400, message: `Insufficient stock for ${item.productName}` };
      }
    }

    for (const item of challan.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });

      await tx.stockLog.create({
        data: {
          productId: item.productId,
          quantity: item.quantity,
          movementType: "OUT",
          reason: `Challan ${challan.challanNumber} confirmed`,
          createdById: confirmedById,
        },
      });
    }

    return tx.challan.update({
      where: { id },
      data: { status: "CONFIRMED" },
      include: { items: true, customer: true },
    });
  });
}

export async function cancelChallan(id: string) {
  const challan = await prisma.challan.findUnique({ where: { id } });
  if (!challan) {
    throw { status: 404, message: "Challan not found" };
  }
  if (challan.status === "CONFIRMED") {
    throw { status: 400, message: "Cannot cancel a confirmed challan" };
  }

  return prisma.challan.update({ where: { id }, data: { status: "CANCELLED" } });
}