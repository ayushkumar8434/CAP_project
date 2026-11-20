import { Router } from "express";
import multer from "multer";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { authMiddleware } from "../middleware/authMiddleware.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const UPLOAD_DIR = path.join(__dirname, "../../uploads");

const ALLOWED = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" };

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  // Random name + extension from the verified mimetype, never the client's filename.
  filename: (req, file, cb) =>
    cb(null, `${crypto.randomUUID()}${ALLOWED[file.mimetype]}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 4 },
  fileFilter: (req, file, cb) =>
    ALLOWED[file.mimetype]
      ? cb(null, true)
      : cb(new Error("Only JPG, PNG or WEBP images are allowed.")),
});

// Checks the real file signature, since the client-declared mimetype can be faked.
function hasImageSignature(file) {
  const buf = Buffer.alloc(12);
  const fd = fs.openSync(file.path, "r");
  try {
    fs.readSync(fd, buf, 0, 12, 0);
  } finally {
    fs.closeSync(fd);
  }
  const isPng = buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  const isJpg = buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
  const isWebp = buf.subarray(0, 4).toString() === "RIFF" && buf.subarray(8, 12).toString() === "WEBP";
  return isPng || isJpg || isWebp;
}

const router = Router();

// POST /api/uploads  (field name: images, up to 4 files, 5MB each)
router.post("/", authMiddleware, (req, res) => {
  upload.array("images", 4)(req, res, (err) => {
    if (err) {
      const message =
        err.code === "LIMIT_FILE_SIZE" ? "Each image must be 5MB or smaller."
        : err.code === "LIMIT_FILE_COUNT" || err.code === "LIMIT_UNEXPECTED_FILE" ? "You can upload up to 4 images."
        : err.message;
      return res.status(400).json({ success: false, message });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No images received." });
    }
    const invalid = req.files.filter((f) => !hasImageSignature(f));
    if (invalid.length > 0) {
      req.files.forEach((f) => fs.unlink(f.path, () => {}));
      return res.status(400).json({ success: false, message: "One of the files is not a valid image." });
    }
    return res.status(201).json({
      success: true,
      urls: req.files.map((f) => `/uploads/${f.filename}`),
    });
  });
});

export default router;
