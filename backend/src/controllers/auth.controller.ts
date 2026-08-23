import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/auth.service";

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;
  const { user, token } = await registerUser(name, email, password);
  res.status(201).json({ success: true, data: { user, token } });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const { user, token } = await loginUser(email, password);
  res.status(200).json({ success: true, data: { user, token } });
}
