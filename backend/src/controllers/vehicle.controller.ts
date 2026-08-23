import { Request, Response } from "express";
import { AppError } from "../utils/AppError";
import {
  createVehicle,
  deleteVehicle,
  getVehicleById,
  listVehicles,
  purchaseVehicle,
  restockVehicle,
  updateVehicle
} from "../services/vehicle.service";

function parseId(raw: string): number {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(400, "Invalid vehicle id");
  }
  return id;
}

export async function create(req: Request, res: Response) {
  const vehicle = await createVehicle(req.body);
  res.status(201).json({ success: true, data: vehicle });
}

export async function list(req: Request, res: Response) {
  const vehicles = await listVehicles(req.query as never);
  res.status(200).json({ success: true, data: vehicles });
}

export async function search(req: Request, res: Response) {
  const vehicles = await listVehicles(req.query as never);
  res.status(200).json({ success: true, data: vehicles });
}

export async function getOne(req: Request, res: Response) {
  const id = parseId(req.params.id);
  const vehicle = await getVehicleById(id);
  res.status(200).json({ success: true, data: vehicle });
}

export async function update(req: Request, res: Response) {
  const id = parseId(req.params.id);
  const vehicle = await updateVehicle(id, req.body);
  res.status(200).json({ success: true, data: vehicle });
}

export async function remove(req: Request, res: Response) {
  const id = parseId(req.params.id);
  await deleteVehicle(id);
  res.status(200).json({ success: true, message: "Vehicle deleted" });
}

export async function purchase(req: Request, res: Response) {
  const id = parseId(req.params.id);
  const vehicle = await purchaseVehicle(id);
  res.status(200).json({ success: true, message: "Purchase successful", data: vehicle });
}

export async function restock(req: Request, res: Response) {
  const id = parseId(req.params.id);
  const { quantity } = req.body;
  const vehicle = await restockVehicle(id, quantity);
  res.status(200).json({ success: true, message: "Vehicle restocked", data: vehicle });
}
