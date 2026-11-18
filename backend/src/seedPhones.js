import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Phone from "./models/Phone.js";
import User from "./models/User.js";

dotenv.config();

const samplePhones = [
  {
    title: "iPhone 15 Pro Max - Excellent Condition",
    brand: "Apple",
    model: "iPhone 15 Pro Max",
    price: 85000,
    condition: "Excellent",
    storage: "256GB",
    status: "available",
    description: "Barely used iPhone 15 Pro Max in pristine condition with original box and accessories.",
  },
  {
    title: "Samsung Galaxy S23 Ultra",
    brand: "Samsung",
    model: "Galaxy S23 Ultra",
    price: 65000,
    condition: "Good",
    storage: "512GB",
    status: "available",
    description: "Samsung Galaxy S23 Ultra with minor scratches on the back. Works perfectly.",
  },
  {
    title: "iPhone 14 - Good Condition",
    brand: "Apple",
    model: "iPhone 14",
    price: 55000,
    condition: "Good",
    storage: "128GB",
    status: "available",
    description: "Well-maintained iPhone 14 with minor wear and tear.",
  },
  {
    title: "OnePlus 11 5G",
    brand: "OnePlus",
    model: "OnePlus 11",
    price: 42000,
    condition: "Excellent",
    storage: "256GB",
    status: "available",
    description: "Like-new OnePlus 11 with all original accessories.",
  },
  {
    title: "Google Pixel 8 Pro",
    brand: "Google",
    model: "Pixel 8 Pro",
    price: 58000,
    condition: "Excellent",
    storage: "128GB",
    status: "available",
    description: "Google Pixel 8 Pro in mint condition with warranty remaining.",
  },
  {
    title: "iPhone 13 Pro - Fair Condition",
    brand: "Apple",
    model: "iPhone 13 Pro",
    price: 48000,
    condition: "Fair",
    storage: "128GB",
    status: "available",
    description: "iPhone 13 Pro with some scratches and minor dents.",
  },
  {
    title: "Samsung Galaxy S22",
    brand: "Samsung",
    model: "Galaxy S22",
    price: 38000,
    condition: "Good",
    storage: "128GB",
    status: "available",
    description: "Samsung Galaxy S22 in good working condition.",
  },
  {
    title: "iPhone 12 - Excellent",
    brand: "Apple",
    model: "iPhone 12",
    price: 38000,
    condition: "Excellent",
    storage: "64GB",
    status: "available",
    description: "iPhone 12 in excellent condition with 64GB storage.",
  },
  {
    title: "Xiaomi 13 Pro",
    brand: "Xiaomi",
    model: "13 Pro",
    price: 52000,
    condition: "Excellent",
    storage: "256GB",
    status: "available",
    description: "Xiaomi 13 Pro flagship phone in pristine condition.",
  },
  {
    title: "OnePlus 10 Pro",
    brand: "OnePlus",
    model: "OnePlus 10 Pro",
    price: 35000,
    condition: "Good",
    storage: "256GB",
    status: "available",
    description: "OnePlus 10 Pro with Hasselblad camera in good condition.",
  },
  {
    title: "iPhone 15 - Available Now",
    brand: "Apple",
    model: "iPhone 15",
    price: 72000,
    condition: "Excellent",
    storage: "128GB",
    status: "available",
    description: "Brand new iPhone 15 with full warranty.",
  },
  {
    title: "Samsung Galaxy Z Fold 5",
    brand: "Samsung",
    model: "Galaxy Z Fold 5",
    price: 95000,
    condition: "Excellent",
    storage: "512GB",
    status: "available",
    description: "Foldable Samsung phone in excellent condition.",
  },
  {
    title: "iPhone 11 - Budget Option",
    brand: "Apple",
    model: "iPhone 11",
    price: 28000,
    condition: "Fair",
    storage: "64GB",
    status: "available",
    description: "Budget-friendly iPhone 11 with some wear.",
  },
  {
    title: "Google Pixel 7",
    brand: "Google",
    model: "Pixel 7",
    price: 38000,
    condition: "Good",
    storage: "128GB",
    status: "available",
    description: "Google Pixel 7 with excellent camera quality.",
  },
  {
    title: "Samsung Galaxy A54",
    brand: "Samsung",
    model: "Galaxy A54",
    price: 28000,
    condition: "Excellent",
    storage: "128GB",
    status: "available",
    description: "Mid-range Samsung phone in excellent condition.",
  },
  {
    title: "iPhone 14 Pro Max - SOLD",
    brand: "Apple",
    model: "iPhone 14 Pro Max",
    price: 88000,
    condition: "Excellent",
    storage: "512GB",
    status: "sold",
    description: "This phone has been sold.",
  },
  {
    title: "OnePlus 9 Pro",
    brand: "OnePlus",
    model: "OnePlus 9 Pro",
    price: 32000,
    condition: "Good",
    storage: "256GB",
    status: "available",
    description: "OnePlus 9 Pro with Hasselblad camera in good shape.",
  },
  {
    title: "iPhone 13 - Reserved",
    brand: "Apple",
    model: "iPhone 13",
    price: 45000,
    condition: "Good",
    storage: "128GB",
    status: "reserved",
    description: "This phone is currently reserved.",
  },
  {
    title: "Xiaomi 12",
    brand: "Xiaomi",
    model: "12",
    price: 35000,
    condition: "Good",
    storage: "256GB",
    status: "available",
    description: "Xiaomi 12 with great specs at an affordable price.",
  },
  {
    title: "iPhone 15 Pro - Premium",
    brand: "Apple",
    model: "iPhone 15 Pro",
    price: 95000,
    condition: "Excellent",
    storage: "1TB",
    status: "available",
    description: "Top-of-the-line iPhone 15 Pro with 1TB storage.",
  },
];

async function seedDatabase() {
  try {
    await connectDB();

    // Find a user to associate phones with
    let user = await User.findOne();

    if (!user) {
      console.log("No users found. Creating a test user...");
      user = await User.create({
        name: "Test Seller",
        email: "seller@test.com",
        password: "$2a$10$X8qZ4YQwZ4YQwZ4YQwZ4Ye", // Dummy hashed password
        role: "user",
      });
      console.log("Test user created.");
    }

    // Clear existing phones
    await Phone.deleteMany({});
    console.log("Cleared existing phone listings.");

    // Add seller ID to each phone
    const phonesWithSeller = samplePhones.map((phone) => ({
      ...phone,
      seller: user._id,
    }));

    // Insert sample phones
    await Phone.insertMany(phonesWithSeller);

    console.log(`✅ Successfully seeded ${samplePhones.length} phones!`);
    console.log("\nBreakdown:");
    console.log(`- Available: ${samplePhones.filter((p) => p.status === "available").length}`);
    console.log(`- Sold: ${samplePhones.filter((p) => p.status === "sold").length}`);
    console.log(`- Reserved: ${samplePhones.filter((p) => p.status === "reserved").length}`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
