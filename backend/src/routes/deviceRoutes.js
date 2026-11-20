import { Router } from "express";
import { searchDevices, getUsage } from "../controllers/deviceController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();
router.get("/search", authMiddleware, searchDevices);
router.get("/usage", authMiddleware, getUsage);
export default router;
