import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error(
      "STARTUP ERROR: MONGO_URI is not set. Add it in your host's environment variables (Render -> Environment)."
    );
    process.exit(1);
  }
  if (!process.env.JWT_SECRET) {
    console.error("STARTUP ERROR: JWT_SECRET is not set. Add it in your host's environment variables.");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error(`STARTUP ERROR: could not connect to MongoDB (${error.code || error.name}): ${error.message}`);
    console.error(
      "Check: the password in MONGO_URI (URL-encode symbols), the database user's role, and that Atlas Network Access allows 0.0.0.0/0."
    );
    process.exit(1);
  }
}
