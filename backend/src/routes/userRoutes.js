import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  getMyProfile,
  updateMyProfile,
} from "../controllers/userController.js";

const router = Router();

router.get("/me", authMiddleware, getMyProfile);
router.put("/me", authMiddleware, updateMyProfile);

export default router;
