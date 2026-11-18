import { Router } from "express";
import { searchPhones, getAllPhones } from "../controllers/searchController.js";

const router = Router();

// IMPORTANT: Route order matters!
// /search must come BEFORE /:id routes (Member 1's CRUD)
// Otherwise "search" would be treated as an ID parameter

// Search route must come before /:id routes to prevent "search" being treated as an ID
router.get("/search", searchPhones);

// Get all phones with filtering, sorting and pagination
router.get("/", getAllPhones);

// Member 1 will add CRUD routes here:
// router.get("/:id", getPhoneById);      // Member 1
// router.post("/", createPhone);         // Member 1
// router.put("/:id", updatePhone);       // Member 1
// router.delete("/:id", deletePhone);    // Member 1

export default router;
