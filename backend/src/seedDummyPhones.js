/**
 * Adds the 16 smartphones from the DummyJSON catalogue to the marketplace.
 * Safe to run more than once: each phone is matched by title + seller and updated.
 * Existing listings are never deleted.
 *
 *   node src/seedDummyPhones.js
 */
import crypto from "crypto";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import Phone from "./models/Phone.js";
import User from "./models/User.js";

dotenv.config();

const CDN = "https://cdn.dummyjson.com/product-images/smartphones";
const USD_TO_INR = 85;

// [slug, title, brand, price in USD, rating, stock, image count, description]
const CATALOGUE = [
  ["iphone-5s", "iPhone 5s", "Apple", 199.99, 2.83, 25, 3, "The iPhone 5s is a classic smartphone known for its compact design and advanced features during its release. While it's an older model, it still provides a reliable user experience."],
  ["iphone-6", "iPhone 6", "Apple", 299.99, 3.41, 60, 3, "The iPhone 6 is a stylish and capable smartphone with a larger display and improved performance. It introduced new features and design elements, making it a popular choice in its time."],
  ["iphone-13-pro", "iPhone 13 Pro", "Apple", 1099.99, 4.12, 56, 3, "The iPhone 13 Pro is a cutting-edge smartphone with a powerful camera system, high-performance chip, and stunning display. It offers advanced features for users who demand top-notch technology."],
  ["iphone-x", "iPhone X", "Apple", 899.99, 2.51, 37, 3, "The iPhone X is a flagship smartphone featuring a bezel-less OLED display, facial recognition technology (Face ID), and impressive performance. It represents a milestone in iPhone design and innovation."],
  ["oppo-a57", "Oppo A57", "Oppo", 249.99, 3.94, 19, 3, "The Oppo A57 is a mid-range smartphone known for its sleek design and capable features. It offers a balance of performance and affordability, making it a popular choice."],
  ["oppo-f19-pro-plus", "Oppo F19 Pro Plus", "Oppo", 399.99, 3.51, 78, 3, "The Oppo F19 Pro Plus is a feature-rich smartphone with a focus on camera capabilities. It boasts advanced photography features and a powerful performance for a premium user experience."],
  ["oppo-k1", "Oppo K1", "Oppo", 299.99, 4.25, 55, 4, "The Oppo K1 series offers a range of smartphones with various features and specifications. Known for their stylish design and reliable performance, the Oppo K1 series caters to diverse user preferences."],
  ["realme-c35", "Realme C35", "Realme", 149.99, 4.2, 48, 3, "The Realme C35 is a budget-friendly smartphone with a focus on providing essential features for everyday use. It offers a reliable performance and user-friendly experience."],
  ["realme-x", "Realme X", "Realme", 299.99, 3.7, 12, 3, "The Realme X is a mid-range smartphone known for its sleek design and impressive display. It offers a good balance of performance and camera capabilities for users seeking a quality device."],
  ["realme-xt", "Realme XT", "Realme", 349.99, 4.58, 80, 3, "The Realme XT is a feature-rich smartphone with a focus on camera technology. It comes equipped with advanced camera sensors, delivering high-quality photos and videos for photography enthusiasts."],
  ["samsung-galaxy-s7", "Samsung Galaxy S7", "Samsung", 299.99, 3.3, 67, 3, "The Samsung Galaxy S7 is a flagship smartphone known for its sleek design and advanced features. It features a high-resolution display, powerful camera, and robust performance."],
  ["samsung-galaxy-s8", "Samsung Galaxy S8", "Samsung", 499.99, 4.4, 0, 3, "The Samsung Galaxy S8 is a premium smartphone with an Infinity Display, offering a stunning visual experience. It boasts advanced camera capabilities and cutting-edge technology."],
  ["samsung-galaxy-s10", "Samsung Galaxy S10", "Samsung", 699.99, 3.06, 19, 3, "The Samsung Galaxy S10 is a flagship device featuring a dynamic AMOLED display, versatile camera system, and powerful performance. It represents innovation and excellence in smartphone technology."],
  ["vivo-s1", "Vivo S1", "Vivo", 249.99, 3.5, 50, 3, "The Vivo S1 is a stylish and mid-range smartphone offering a blend of design and performance. It features a vibrant display, capable camera system, and reliable functionality."],
  ["vivo-v9", "Vivo V9", "Vivo", 299.99, 3.6, 82, 3, "The Vivo V9 is a smartphone known for its sleek design and emphasis on capturing high-quality selfies. It features a notch display, dual-camera setup, and a modern design."],
  ["vivo-x21", "Vivo X21", "Vivo", 499.99, 4.26, 7, 3, "The Vivo X21 is a premium smartphone with a focus on cutting-edge technology. It features an in-display fingerprint sensor, a high-resolution display, and advanced camera capabilities."],
];

// The catalogue has no condition or storage, so these are derived / defaulted.
const conditionFromRating = (r) => (r >= 4 ? "Excellent" : r >= 3.5 ? "Good" : r >= 3 ? "Fair" : "Poor");
const toInr = (usd) => Math.round((usd * USD_TO_INR) / 100) * 100;

async function getStoreSeller() {
  const email = "store@pocketphone.local";
  let user = await User.findOne({ email });
  if (!user) {
    // Random password nobody knows, so this account cannot be logged into.
    user = await User.create({
      name: "PocketPhone Store",
      email,
      password: await bcrypt.hash(crypto.randomBytes(24).toString("hex"), 10),
    });
  }
  return user;
}

async function run() {
  await connectDB();
  const seller = await getStoreSeller();
  let created = 0;
  let updated = 0;

  for (const [slug, title, brand, usd, rating, stock, imageCount, description] of CATALOGUE) {
    const doc = {
      title,
      brand,
      model: title,
      price: toInr(usd),
      condition: conditionFromRating(rating),
      storage: "128GB",
      status: stock > 0 ? "available" : "sold",
      description,
      images: Array.from({ length: imageCount }, (_, i) => `${CDN}/${slug}/${i + 1}.webp`),
      seller: seller._id,
    };
    const existing = await Phone.findOne({ title, seller: seller._id });
    if (existing) {
      await Phone.updateOne({ _id: existing._id }, { $set: doc });
      updated++;
    } else {
      await Phone.create(doc);
      created++;
    }
  }

  console.log(`Done. Created ${created}, updated ${updated}. Total phones: ${await Phone.countDocuments()}`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
