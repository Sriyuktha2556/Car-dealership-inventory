import express from "express";
import cors from "cors";
import { env } from "./config/env";
import authRoutes from "./routes/auth.routes";
import vehicleRoutes from "./routes/vehicle.routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.frontendUrl }));
  app.use(express.json({ limit: "100kb" }));

  app.get("/api/health", (_req, res) => {
    res.status(200).json({ success: true, message: "OK" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/vehicles", vehicleRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
