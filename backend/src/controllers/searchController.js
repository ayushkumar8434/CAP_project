import Phone from "../models/Phone.js";

/**
 * ⚠️ IMPORTANT: This controller uses Phone model from ../models/Phone.js
 * 
 * Member 1 OWNS the Phone model. The current Phone.js is temporary.
 * Before production, ensure this imports Member 1's official Phone model.
 * 
 * Enum values (condition, storage) are currently hardcoded and must match
 * Member 1's final Phone schema.
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
