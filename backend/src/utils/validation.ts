import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(120),
  email: z.string().trim().toLowerCase().email("A valid email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Za-z]/, "Password must contain a letter")
    .regex(/[0-9]/, "Password must contain a number")
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("A valid email is required"),
  password: z.string().min(1, "Password is required")
});

export const vehicleCreateSchema = z.object({
  make: z.string().trim().min(1, "Make is required").max(80),
  model: z.string().trim().min(1, "Model is required").max(80),
  category: z.string().trim().min(1, "Category is required").max(50),
  price: z.coerce.number().positive("Price must be greater than zero"),
  quantity: z.coerce.number().int().min(0, "Quantity cannot be negative")
});

export const vehicleUpdateSchema = vehicleCreateSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided" }
);

export const restockSchema = z.object({
  quantity: z.coerce.number().int().positive("Restock quantity must be greater than zero")
});

export const vehicleSearchQuerySchema = z.object({
  q: z.string().trim().max(120).optional(),
  category: z.string().trim().max(50).optional(),
  available: z.enum(["true", "false"]).optional(),
  sort: z.enum(["price_asc", "price_desc", "name_asc"]).optional()
});
