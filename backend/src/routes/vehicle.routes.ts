import { Router } from "express";
import {
  create,
  getOne,
  list,
  purchase,
  remove,
  restock,
  search,
  update
} from "../controllers/vehicle.controller";
import { asyncHandler } from "../middleware/errorHandler";
import { requireAuth, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  restockSchema,
  vehicleCreateSchema,
  vehicleSearchQuerySchema,
  vehicleUpdateSchema
} from "../utils/validation";

const router = Router();

// All vehicle endpoints require authentication.
router.use(requireAuth);

router.get("/search", validate(vehicleSearchQuerySchema, "query"), asyncHandler(search));
router.get("/", validate(vehicleSearchQuerySchema, "query"), asyncHandler(list));
router.get("/:id", asyncHandler(getOne));

router.post("/", requireRole("ADMIN"), validate(vehicleCreateSchema), asyncHandler(create));
router.put("/:id", requireRole("ADMIN"), validate(vehicleUpdateSchema), asyncHandler(update));
router.delete("/:id", requireRole("ADMIN"), asyncHandler(remove));

router.post("/:id/purchase", asyncHandler(purchase));
router.post("/:id/restock", requireRole("ADMIN"), validate(restockSchema), asyncHandler(restock));

export default router;
