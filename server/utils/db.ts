import mongoose from "mongoose";

export async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;
  
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not defined");
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export function getDb() {
  const db = mongoose.connection;
  if (!db) {
    throw new Error("Database not connected. Call connectDB first.");
  }
  return db;
}

export function getMongoose() {
  return mongoose;
}
