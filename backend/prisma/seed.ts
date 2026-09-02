/// <reference types="node" />
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("password123", 10);

  const users = [
    { name: "Admin User", email: "admin@erp.com", role: Role.ADMIN },
    { name: "Sales User", email: "sales@erp.com", role: Role.SALES },
    { name: "Warehouse User", email: "warehouse@erp.com", role: Role.WAREHOUSE },
    { name: "Accounts User", email: "accounts@erp.com", role: Role.ACCOUNTS },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        name: u.name,
        email: u.email,
        password,
        role: u.role,
      },
    });
  }

  console.log("Seed complete. All test users use password: password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });