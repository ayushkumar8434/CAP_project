import User from "../models/User.js";

export async function getMyProfile(req, res) {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
}

export async function updateMyProfile(req, res) {
  const updates = req.body;

  if (
    !updates ||
    typeof updates !== "object" ||
    Array.isArray(updates) ||
    Object.keys(updates).length === 0
  ) {
    return res.status(400).json({
      success: false,
      message: "At least one profile field is required",
    });
  }

  const allowedFields = ["name", "email"];
  if (Object.keys(updates).some((field) => !allowedFields.includes(field))) {
    return res.status(400).json({
      success: false,
      message: "Only name and email can be updated",
    });
  }

  if (
    Object.hasOwn(updates, "name") &&
    (typeof updates.name !== "string" || !updates.name.trim())
  ) {
    return res.status(400).json({
      success: false,
      message: "Name must be a non-empty string",
    });
  }

  if (
    Object.hasOwn(updates, "email") &&
    (typeof updates.email !== "string" || !updates.email.trim())
  ) {
    return res.status(400).json({
      success: false,
      message: "Email must be a non-empty string",
    });
  }

  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (Object.hasOwn(updates, "name")) {
      user.name = updates.name.trim();
    }
    if (Object.hasOwn(updates, "email")) {
      user.email = updates.email.trim().toLowerCase();
    }

    await user.save();

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
}
