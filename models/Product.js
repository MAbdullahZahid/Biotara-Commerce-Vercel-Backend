import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String },
  handle: { type: String, unique: true, required: true }, // Shopify handle
  shopifyProductId: { type: String, sparse: true }, // Shopify GID, sparse allows null/undefined
  
  // Review stats (cached for performance)
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  ratingDistribution: {
    5: { type: Number, default: 0 },
    4: { type: Number, default: 0 },
    3: { type: Number, default: 0 },
    2: { type: Number, default: 0 },
    1: { type: Number, default: 0 }
  }
}, { timestamps: true });

// Indexes - using unique directly in schema instead of .index()
// No need for additional .index() calls as unique:true already creates an index

export default mongoose.model("Product", productSchema);
