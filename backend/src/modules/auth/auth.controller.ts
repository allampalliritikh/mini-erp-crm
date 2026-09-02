import { Request, Response, NextFunction } from "express";
import { loginUser } from "./auth.service";

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await loginUser(email, password);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
}