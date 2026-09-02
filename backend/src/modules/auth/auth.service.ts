import prisma from "../../config/db";
import { comparePassword } from "../../utils/password";
import { signToken } from "../../utils/jwt";

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw { status: 401, message: "Invalid email or password" };
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw { status: 401, message: "Invalid email or password" };
  }

  const token = signToken({ id: user.id, role: user.role });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}