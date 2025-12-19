import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    description: { type: String, required: true },
    pics: [{ type: String }], // Multiple images support
    rating: { type: Number, min: 1, max: 5, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    
    // User details from Shopify (cached for display)
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    
    // Product details from Shopify (cached for display)
    productTitle: { type: String, required: true },
    productHandle: { type: String, required: true }, // Shopify product handle
    productImage: { type: String },
    
    // Verification
    isVerifiedPurchase: { type: Boolean, default: false },
    shopifyOrderId: { type: String }, // Shopify order ID if verified
    
    // Engagement
    helpfulCount: { type: Number, default: 0 },
    notHelpfulCount: { type: Number, default: 0 },
    helpfulBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Track who found it helpful
    
    // Moderation
    isApproved: { type: Boolean, default: true }, // Auto-approve or manual moderation
    isFeatured: { type: Boolean, default: false }, // Feature exceptional reviews
    
    // Response
    merchantResponse: { type: String }, // Store owner can respond
    merchantResponseDate: { type: Date }
}, { timestamps: true });

// Indexes for efficient queries
reviewSchema.index({ product: 1, createdAt: -1 });
reviewSchema.index({ user: 1, createdAt: -1 });
reviewSchema.index({ productHandle: 1, isApproved: 1 });
reviewSchema.index({ rating: 1 });

export default mongoose.model("Review", reviewSchema);
