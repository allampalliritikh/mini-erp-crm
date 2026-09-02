import prisma from "../config/db";

export async function generateChallanNo(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.challan.count();
  const nextNumber = (count + 1).toString().padStart(5, "0");
  return `CH-${year}-${nextNumber}`;
}