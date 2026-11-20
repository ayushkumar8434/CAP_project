import mongoose from "mongoose";

// Cached search results, so the same search never spends API quota twice.
const deviceLookupSchema = new mongoose.Schema(
  {
    query: { type: String, required: true, unique: true, index: true },
    devices: { type: [mongoose.Schema.Types.Mixed], default: [] },
  },
  { timestamps: true }
);

// Persistent counter of real calls made to the external API.
const apiUsageSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
});

export const DeviceLookup = mongoose.model("DeviceLookup", deviceLookupSchema);
export const ApiUsage = mongoose.model("ApiUsage", apiUsageSchema);
