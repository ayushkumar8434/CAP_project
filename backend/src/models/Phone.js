import mongoose from "mongoose";

/**
 * ⚠️ TEMPORARY PHONE MODEL - MEMBER 1 OWNERSHIP
 * 
 * This Phone model was created by Member 2 for search functionality development.
 * However, Member 1 OWNS the Phone model and Phone CRUD APIs.
 * 
 * BEFORE PRODUCTION:
 * - Member 1 must review and approve this schema OR
 * - Replace this with Member 1's official Phone model
 * - Ensure enum values match Member 1's requirements
 * - Coordinate any schema changes with Member 1
 * 
 * Current Status: Member 1's branch not found on remote
 * Action Required: Member 1 coordination pending
 */

const phoneSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    condition: {
      type: String,
      required: true,
      enum: ["Excellent", "Good", "Fair", "Poor"],
    },
    storage: {
      type: String,
      required: true,
      enum: ["64GB", "128GB", "256GB", "512GB", "1TB"],
    },
    status: {
      type: String,
      required: true,
      enum: ["available", "sold", "reserved"],
      default: "available",
    },
    description: {
      type: String,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Index for search performance
phoneSchema.index({ title: "text", brand: "text", model: "text" });
phoneSchema.index({ brand: 1, price: 1, status: 1 });

const Phone = mongoose.model("Phone", phoneSchema);

export default Phone;
