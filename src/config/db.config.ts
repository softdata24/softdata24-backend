import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log("Connection String:", process.env.MONGODB_URI)
    await mongoose.connect(process.env.MONGODB_URI || "");
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ DB connection failed");
    console.error(err);
    console.error("Ensure that MongoDB is running and the connection string is correct.");
    // process.exit(1);
  }
};
