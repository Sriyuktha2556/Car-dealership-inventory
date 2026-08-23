import { api } from "./client";
import { SearchParams, Vehicle, VehicleFormInput } from "../types";

function toQueryString(params: SearchParams): string {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.category) search.set("category", params.category);
  if (params.available) search.set("available", params.available);
  if (params.sort) search.set("sort", params.sort);
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export function fetchVehicles(params: SearchParams = {}) {
  return api.get<Vehicle[]>(`/vehicles${toQueryString(params)}`);
}

export function createVehicleRequest(input: VehicleFormInput) {
  return api.post<Vehicle>("/vehicles", input);
}

export function updateVehicleRequest(id: number, input: Partial<VehicleFormInput>) {
  return api.put<Vehicle>(`/vehicles/${id}`, input);
}

export function deleteVehicleRequest(id: number) {
  return api.delete<null>(`/vehicles/${id}`);
}

export function purchaseVehicleRequest(id: number) {
  return api.post<Vehicle>(`/vehicles/${id}/purchase`);
}

export function restockVehicleRequest(id: number, quantity: number) {
  return api.post<Vehicle>(`/vehicles/${id}/restock`, { quantity });
}
