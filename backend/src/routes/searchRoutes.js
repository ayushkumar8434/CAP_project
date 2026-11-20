import { Router } from "express";
import {
  searchPhones,
  getAllPhones,
  getPhoneById,
  createPhone,
  updatePhone,
  deletePhone,
} from "../controllers/searchController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

// IMPORTANT: Route order matters!
// /search must come BEFORE /:id routes
// Otherwise "search" would be treated as an ID parameter

// Search route must come before /:id routes to prevent "search" being treated as an ID
router.get("/search", searchPhones);

// Get all phones with filtering, sorting and pagination
router.get("/", getAllPhones);

// CRUD routes for individual phones
// GET single phone by ID (public - no auth required)
router.get("/:id", getPhoneById);

// POST create new phone (requires authentication)
router.post("/", authMiddleware, createPhone);

// PUT update phone by ID (requires authentication + ownership check in controller)
router.put("/:id", authMiddleware, updatePhone);

// DELETE phone by ID (requires authentication + ownership check in controller)
router.delete("/:id", authMiddleware, deletePhone);

export default router;
