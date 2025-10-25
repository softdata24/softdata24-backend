import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log("Connection String:", process.env.MONGODB_URI)
    await mongoose.connect(process.env.MONGODB_URI || "");
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ DB connection failed");
    // process.exit(1);
  }
};
