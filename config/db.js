import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Import models
import User from "../models/User.js";
import Product from "../models/Product.js";
import Review from "../models/Review.js";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Atlas Connected Successfully");

    // Check collections
    const existingCollections = (await mongoose.connection.db.listCollections().toArray())
      .map((col) => col.name);

    const requiredCollections = ["users", "products", "reviews"];

    for (let col of requiredCollections) {
      if (!existingCollections.includes(col)) {
        await mongoose.connection.db.createCollection(col);
        console.log(`Created missing collection: ${col}`);
      }
    }

    console.log("All models verified.");
  } catch (error) {
    console.error("MongoDB Connection ERROR:", error.message);
    process.exit(1);
  }
};

export default connectDB;
