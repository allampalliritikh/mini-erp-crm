import prisma from "../../config/db";

interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export async function listCustomers(params: ListParams) {
  const page = params.page || 1;
  const limit = params.limit || 10;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (params.status) {
    where.status = params.status;
  }

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { mobile: { contains: params.search, mode: "insensitive" } },
      { businessName: { contains: params.search, mode: "insensitive" } },
    ];
  }

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.customer.count({ where }),
  ]);

  return {
    customers,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getCustomerById(id: string) {
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      notes: { orderBy: { createdAt: "desc" } },
      challans: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!customer) {
    throw { status: 404, message: "Customer not found" };
  }

  return customer;
}

export async function createCustomer(data: any) {
  return prisma.customer.create({ data });
}

export async function updateCustomer(id: string, data: any) {
  const existing = await prisma.customer.findUnique({ where: { id } });
  if (!existing) {
    throw { status: 404, message: "Customer not found" };
  }

  return prisma.customer.update({ where: { id }, data });
}

export async function addFollowUpNote(customerId: string, note: string) {
  const existing = await prisma.customer.findUnique({ where: { id: customerId } });
  if (!existing) {
    throw { status: 404, message: "Customer not found" };
  }

  return prisma.followUpNote.create({
    data: { customerId, note },
  });
}