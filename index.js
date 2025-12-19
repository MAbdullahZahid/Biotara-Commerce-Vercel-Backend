import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";

import mediaRoutes from "./Routes/mediaRoutes.js";
import productRoutes from "./Routes/productRoutes.js";
import reviewRoutes from "./Routes/reviewRoutes.js";
import userRoutes from "./Routes/userRoutes.js";



dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    success: true, 
    message: "Review Plugin Backend API is running",
    endpoints: {
      products: "/api/products",
      users: "/api/users",
      reviews: "/api/reviews",
      media: "/api/media"
    }
  });
});

app.get("/api/health", (req, res) => {
  res.json({ 
    success: true, 
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

// Use routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);

app.use("/api/media", mediaRoutes);

// Serve static files from uploads directory
// This allows images to be accessed via http://localhost:5000/uploads/filename.jpg
app.use("/uploads", express.static("uploads", {
  setHeaders: (res, path) => {
    // Set CORS headers for images
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
  }
}));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n✅ Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📝 API Base: http://localhost:${PORT}/api`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  - Products: http://localhost:${PORT}/api/products`);
  console.log(`  - Users: http://localhost:${PORT}/api/users`);
  console.log(`  - Reviews: http://localhost:${PORT}/api/reviews`);
  console.log(`  - Media: http://localhost:${PORT}/api/media\n`);
});
