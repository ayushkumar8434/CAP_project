import Phone from "../models/Phone.js";
import mongoose from "mongoose";

/**
 * ⚠️ IMPORTANT: This controller uses Phone model from ../models/Phone.js
 * 
 * Member 2 now owns Phone model and CRUD operations.
 * Enum values (condition, storage) must match the Phone schema.
 */

/**
 * Build filter object from query parameters
 */
const buildFilterObject = (queryParams) => {
  const {
    q,
    brand,
    minPrice,
    maxPrice,
    condition,
    storage,
  } = queryParams;

  const filter = {};
  const errors = [];

  // Default: only show available listings
  filter.status = "available";

  // Search functionality (case-insensitive search on title, brand, model)
  if (q && q.trim()) {
    const searchTerm = q.trim();
    // Escape special regex characters to prevent injection
    const escapedSearch = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { title: { $regex: escapedSearch, $options: "i" } },
      { brand: { $regex: escapedSearch, $options: "i" } },
      { model: { $regex: escapedSearch, $options: "i" } },
    ];
  }

  // Filter by brand
  if (brand && brand.trim()) {
    filter.brand = { $regex: `^${brand.trim()}$`, $options: "i" };
  }

  // Filter by price range
  if (minPrice || maxPrice) {
    filter.price = {};

    if (minPrice) {
      const min = parseFloat(minPrice);
      if (isNaN(min) || min < 0 || !isFinite(min)) {
        errors.push("Invalid minPrice value. Must be a non-negative number.");
        return { filter: null, errors };
      }
      filter.price.$gte = min;
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice);
      if (isNaN(max) || max < 0 || !isFinite(max)) {
        errors.push("Invalid maxPrice value. Must be a non-negative number.");
        return { filter: null, errors };
      }
      filter.price.$lte = max;
    }

    // Validate min <= max
    if (minPrice && maxPrice && filter.price.$gte > filter.price.$lte) {
      errors.push("minPrice cannot be greater than maxPrice.");
      return { filter: null, errors };
    }
  }

  // Filter by condition
  if (condition && condition.trim()) {
    const validConditions = ["Excellent", "Good", "Fair", "Poor"];
    const conditionValue = condition.trim();

    // Case-insensitive validation
    const matchedCondition = validConditions.find(
      (c) => c.toLowerCase() === conditionValue.toLowerCase()
    );

    if (!matchedCondition) {
      errors.push(
        `Invalid condition. Must be one of: ${validConditions.join(", ")}`
      );
      return { filter: null, errors };
    }

    filter.condition = matchedCondition;
  }

  // Filter by storage
  if (storage && storage.trim()) {
    const validStorage = ["64GB", "128GB", "256GB", "512GB", "1TB"];
    const storageValue = storage.trim();

    if (!validStorage.includes(storageValue)) {
      errors.push(
        `Invalid storage. Must be one of: ${validStorage.join(", ")}`
      );
      return { filter: null, errors };
    }

    filter.storage = storageValue;
  }

  return { filter, errors };
};

/**
 * Build sort option from query parameter
 */
const buildSortOption = (sort = "newest") => {
  const validSortValues = ["price_asc", "price_desc", "newest"];

  if (!validSortValues.includes(sort)) {
    return {
      sortOption: null,
      error: `Invalid sort value. Must be one of: ${validSortValues.join(", ")}`,
    };
  }

  let sortOption = {};

  switch (sort) {
    case "price_asc":
      sortOption = { price: 1, createdAt: -1 }; // secondary sort by newest
      break;
    case "price_desc":
      sortOption = { price: -1, createdAt: -1 }; // secondary sort by newest
      break;
    case "newest":
    default:
      sortOption = { createdAt: -1, _id: -1 }; // secondary sort by _id for consistency
      break;
  }

  return { sortOption, error: null };
};

/**
 * Validate and parse pagination parameters
 */
const validatePagination = (page = 1, limit = 10) => {
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const errors = [];

  if (isNaN(pageNum) || pageNum < 1) {
    errors.push("Invalid page number. Must be a positive integer.");
  }

  if (isNaN(limitNum) || limitNum < 1) {
    errors.push("Invalid limit. Must be a positive integer.");
  }

  if (errors.length > 0) {
    return { pageNum: null, cappedLimit: null, skip: null, errors };
  }

  // Cap limit at 50 to prevent excessive data retrieval
  const cappedLimit = Math.min(limitNum, 50);
  const skip = (pageNum - 1) * cappedLimit;

  return { pageNum, cappedLimit, skip, errors: [] };
};

/**
 * Search and filter phones with pagination
 * GET /api/phones/search
 * GET /api/phones
 */
const queryPhones = async (req, res) => {
  try {
    const { sort = "newest", page = 1, limit = 10 } = req.query;

    // Build filter object
    const { filter, errors: filterErrors } = buildFilterObject(req.query);
    if (filterErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: filterErrors[0],
      });
    }

    // Build sort option
    const { sortOption, error: sortError } = buildSortOption(sort);
    if (sortError) {
      return res.status(400).json({
        success: false,
        message: sortError,
      });
    }

    // Validate pagination
    const {
      pageNum,
      cappedLimit,
      skip,
      errors: paginationErrors,
    } = validatePagination(page, limit);

    if (paginationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: paginationErrors[0],
      });
    }

    // Execute query
    const phones = await Phone.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(cappedLimit)
      .select("-__v")
      .populate("seller", "name email");

    // Count total matching documents
    const totalPhones = await Phone.countDocuments(filter);
    const totalPages = Math.ceil(totalPhones / cappedLimit);

    // Return response
    res.status(200).json({
      success: true,
      totalPhones,
      currentPage: pageNum,
      totalPages,
      limit: cappedLimit,
      phones,
    });
  } catch (error) {
    console.error("Phone query error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while querying phones.",
      error: error.message,
    });
  }
};

/**
 * Search phones by keyword
 * GET /api/phones/search
 */
export const searchPhones = queryPhones;

/**
 * Get all phones with filtering, sorting and pagination
 * GET /api/phones
 */
export const getAllPhones = queryPhones;

/**
 * Get a single phone by ID
 * GET /api/phones/:id
 */
export const getPhoneById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone ID format.",
      });
    }

    // Find phone by ID
    const phone = await Phone.findById(id)
      .select("-__v")
      .populate("seller", "name email");

    if (!phone) {
      return res.status(404).json({
        success: false,
        message: "Phone not found.",
      });
    }

    return res.status(200).json({
      success: true,
      phone,
    });
  } catch (error) {
    console.error("Get phone by ID error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching phone.",
      error: error.message,
    });
  }
};

/**
 * Create a new phone listing
 * POST /api/phones
 * Requires authentication
 */
export const createPhone = async (req, res) => {
  try {
    const {
      title,
      brand,
      model,
      price,
      condition,
      storage,
      status,
      description,
      images,
    } = req.body;

    // Validate required fields
    if (!title || !brand || !model || price === undefined || !condition || !storage) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: title, brand, model, price, condition, and storage are required.",
      });
    }

    // Validate price
    if (typeof price !== "number" || price < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a non-negative number.",
      });
    }

    // Validate condition enum
    const validConditions = ["Excellent", "Good", "Fair", "Poor"];
    if (!validConditions.includes(condition)) {
      return res.status(400).json({
        success: false,
        message: `Invalid condition. Must be one of: ${validConditions.join(", ")}`,
      });
    }

    // Validate storage enum
    const validStorage = ["64GB", "128GB", "256GB", "512GB", "1TB"];
    if (!validStorage.includes(storage)) {
      return res.status(400).json({
        success: false,
        message: `Invalid storage. Must be one of: ${validStorage.join(", ")}`,
      });
    }

    // Validate status enum if provided
    if (status) {
      const validStatus = ["available", "sold", "reserved"];
      if (!validStatus.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatus.join(", ")}`,
        });
      }
    }

    // Validate images array if provided
    if (images && !Array.isArray(images)) {
      return res.status(400).json({
        success: false,
        message: "Images must be an array of strings.",
      });
    }

    // Get seller from authenticated user
    const seller = req.user.id;

    // Create phone listing
    const phone = await Phone.create({
      title: title.trim(),
      brand: brand.trim(),
      model: model.trim(),
      price,
      condition,
      storage,
      status: status || "available",
      description: description ? description.trim() : undefined,
      images: images || [],
      seller,
    });

    // Populate seller information
    await phone.populate("seller", "name email");

    return res.status(201).json({
      success: true,
      message: "Phone listing created successfully.",
      phone,
    });
  } catch (error) {
    console.error("Create phone error:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error.",
        error: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while creating phone listing.",
      error: error.message,
    });
  }
};

/**
 * Update an existing phone listing
 * PUT /api/phones/:id
 * Requires authentication
 */
export const updatePhone = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone ID format.",
      });
    }

    // Find existing phone
    const phone = await Phone.findById(id);

    if (!phone) {
      return res.status(404).json({
        success: false,
        message: "Phone not found.",
      });
    }

    // Check ownership (only the seller can update their listing)
    if (phone.seller.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this phone listing.",
      });
    }

    const {
      title,
      brand,
      model,
      price,
      condition,
      storage,
      status,
      description,
      images,
    } = req.body;

    // Validate updates if provided
    if (price !== undefined && (typeof price !== "number" || price < 0)) {
      return res.status(400).json({
        success: false,
        message: "Price must be a non-negative number.",
      });
    }

    if (condition) {
      const validConditions = ["Excellent", "Good", "Fair", "Poor"];
      if (!validConditions.includes(condition)) {
        return res.status(400).json({
          success: false,
          message: `Invalid condition. Must be one of: ${validConditions.join(", ")}`,
        });
      }
    }

    if (storage) {
      const validStorage = ["64GB", "128GB", "256GB", "512GB", "1TB"];
      if (!validStorage.includes(storage)) {
        return res.status(400).json({
          success: false,
          message: `Invalid storage. Must be one of: ${validStorage.join(", ")}`,
        });
      }
    }

    if (status) {
      const validStatus = ["available", "sold", "reserved"];
      if (!validStatus.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatus.join(", ")}`,
        });
      }
    }

    if (images && !Array.isArray(images)) {
      return res.status(400).json({
        success: false,
        message: "Images must be an array of strings.",
      });
    }

    // Update fields
    if (title) phone.title = title.trim();
    if (brand) phone.brand = brand.trim();
    if (model) phone.model = model.trim();
    if (price !== undefined) phone.price = price;
    if (condition) phone.condition = condition;
    if (storage) phone.storage = storage;
    if (status) phone.status = status;
    if (description !== undefined) phone.description = description ? description.trim() : "";
    if (images) phone.images = images;

    // Save updated phone
    await phone.save();

    // Populate seller information
    await phone.populate("seller", "name email");

    return res.status(200).json({
      success: true,
      message: "Phone listing updated successfully.",
      phone,
    });
  } catch (error) {
    console.error("Update phone error:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error.",
        error: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while updating phone listing.",
      error: error.message,
    });
  }
};

/**
 * Delete a phone listing
 * DELETE /api/phones/:id
 * Requires authentication
 */
export const deletePhone = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone ID format.",
      });
    }

    // Find existing phone
    const phone = await Phone.findById(id);

    if (!phone) {
      return res.status(404).json({
        success: false,
        message: "Phone not found.",
      });
    }

    // Check ownership (only the seller can delete their listing)
    if (phone.seller.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this phone listing.",
      });
    }

    // Delete the phone
    await Phone.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Phone listing deleted successfully.",
    });
  } catch (error) {
    console.error("Delete phone error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting phone listing.",
      error: error.message,
    });
  }
};
