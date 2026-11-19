import { Router } from "express";
import {
  cancelOrder,
  getMyOrders,
  getOrderById,
} from "../controllers/orderController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/my-orders", authMiddleware, getMyOrders);
router.get("/:orderId", authMiddleware, getOrderById);
router.patch("/:orderId/cancel", authMiddleware, cancelOrder);

export default router;
