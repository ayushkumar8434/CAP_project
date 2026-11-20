import { DeviceLookup, ApiUsage } from "../models/DeviceLookup.js";

const API_URL = "https://api.mobileapi.dev/devices/search/";
const USAGE_NAME = "mobileapi";

// Hard ceiling on real calls to the external API (the account's free quota is small).
const callCap = () => Number(process.env.PHONE_API_DAILY_CAP) || 20;

const normalize = (q) =>
  String(q || "").toLowerCase().replace(/[^a-z0-9+ .-]/g, " ").replace(/\s+/g, " ").trim();

// Keep only the fields the app uses; image_b64 is a tiny thumbnail.
const slim = (d) => ({
  id: d.id,
  name: d.name,
  manufacturer: d.manufacturer_name,
  colors: d.colors,
  storage: d.storage,
  screen: d.screen_resolution,
  weight: d.weight,
  release: d.release_date,
  camera: d.camera,
  battery: d.battery_capacity,
  hardware: d.hardware,
  thumb: d.image_b64 ? `data:image/jpeg;base64,${d.image_b64}` : null,
});

/** GET /api/devices/search?name=iphone 13 */
export const searchDevices = async (req, res) => {
  const query = normalize(req.query.name);
  if (query.length < 3 || query.length > 40) {
    return res.status(400).json({ success: false, message: "Enter 3 to 40 characters." });
  }

  try {
    const cached = await DeviceLookup.findOne({ query });
    if (cached) {
      return res.json({ success: true, source: "cache", devices: cached.devices });
    }

    if (!process.env.PHONE_API_KEY) {
      return res.status(503).json({ success: false, message: "Phone lookup is not configured." });
    }

    // Atomically reserve one call; refuse once the cap is reached.
    await ApiUsage.updateOne({ name: USAGE_NAME }, { $setOnInsert: { count: 0 } }, { upsert: true });
    const reserved = await ApiUsage.findOneAndUpdate(
      { name: USAGE_NAME, count: { $lt: callCap() } },
      { $inc: { count: 1 } },
      { new: true }
    );
    if (!reserved) {
      return res.status(429).json({
        success: false,
        message: "Phone lookup limit reached. You can still fill the form manually.",
      });
    }

    const response = await fetch(`${API_URL}?${new URLSearchParams({ name: query })}`, {
      headers: { Authorization: `Bearer ${process.env.PHONE_API_KEY}` },
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) {
      console.error("Device API error status:", response.status);
      return res.status(502).json({ success: false, message: "Phone lookup is unavailable right now." });
    }

    const data = await response.json();
    const devices = (data.devices || [])
      .filter((d) => d.device_type === "phone")
      .slice(0, 8)
      .map(slim);

    await DeviceLookup.updateOne({ query }, { $set: { devices } }, { upsert: true });
    return res.json({ success: true, source: "api", devices });
  } catch (error) {
    console.error("Device search error:", error.message);
    return res.status(502).json({ success: false, message: "Phone lookup is unavailable right now." });
  }
};

/** GET /api/devices/usage */
export const getUsage = async (req, res) => {
  const row = await ApiUsage.findOne({ name: USAGE_NAME });
  res.json({ success: true, used: row?.count || 0, cap: callCap() });
};
