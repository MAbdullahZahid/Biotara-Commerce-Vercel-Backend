import Product from "../models/Product.js";
import Review from "../models/Review.js";

// Helper function to update product stats
async function updateProductStats(productId) {
  try {
    const reviews = await Review.find({ product: productId, isApproved: true });
    const totalReviews = reviews.length;
    
    if (totalReviews === 0) {
      await Product.findByIdAndUpdate(productId, {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      });
      return;
    }
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / totalReviews;
    
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      ratingDistribution[review.rating]++;
    });
    
    await Product.findByIdAndUpdate(productId, {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
      ratingDistribution
    });
  } catch (err) {
    console.error("Error updating product stats:", err);
  }
}

export const addReview = async (req, res) => {
  try {
    const review = await Review.create(req.body);
    
    // Update product stats
    if (review.product) {
      await updateProductStats(review.product);
    }
    
    const populatedReview = await Review.findById(review._id).populate("user product");
    res.status(201).json({ success: true, review: populatedReview });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error adding review", error: err.message });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate("user product").sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching reviews", error: err.message });
  }
};

export const getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate("user product");
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });
    res.json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching review", error: err.message });
  }
};

// Get reviews by product handle (for frontend)
export const getReviewsByProductHandle = async (req, res) => {
  try {
    const { handle } = req.params;
    const { sort = 'recent', page = 1, limit = 10, rating } = req.query;
    
    const query = { productHandle: handle, isApproved: true };
    
    // Filter by rating if specified
    if (rating) {
      query.rating = parseInt(rating);
    }
    
    // Sorting
    let sortOption = { createdAt: -1 }; // Default: most recent
    if (sort === 'helpful') sortOption = { helpfulCount: -1, createdAt: -1 };
    if (sort === 'rating_high') sortOption = { rating: -1, createdAt: -1 };
    if (sort === 'rating_low') sortOption = { rating: 1, createdAt: -1 };
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const reviews = await Review.find(query)
      .populate("user")
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Review.countDocuments(query);
    
    res.json({ 
      success: true, 
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching reviews", error: err.message });
  }
};

// Get review statistics for a product
export const getProductReviewStats = async (req, res) => {
  try {
    const { handle } = req.params;
    
    const product = await Product.findOne({ handle });
    if (!product) {
      return res.json({
        success: true,
        stats: {
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          verifiedPurchaseCount: 0,
          withPhotosCount: 0
        }
      });
    }
    
    const verifiedPurchaseCount = await Review.countDocuments({ 
      productHandle: handle, 
      isVerifiedPurchase: true,
      isApproved: true 
    });
    
    const withPhotosCount = await Review.countDocuments({ 
      productHandle: handle, 
      pics: { $exists: true, $ne: [] },
      isApproved: true 
    });
    
    res.json({
      success: true,
      stats: {
        averageRating: product.averageRating || 0,
        totalReviews: product.totalReviews || 0,
        ratingDistribution: product.ratingDistribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        verifiedPurchaseCount,
        withPhotosCount
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching stats", error: err.message });
  }
};

// Get reviews by user
export const getReviewsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const reviews = await Review.find({ user: userId })
      .populate("product")
      .sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching user reviews", error: err.message });
  }
};

// Mark review as helpful
export const markReviewHelpful = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, helpful } = req.body; // helpful: true/false
    
    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });
    
    const userObjectId = userId;
    const hasVoted = review.helpfulBy.includes(userObjectId);
    
    if (helpful) {
      if (!hasVoted) {
        review.helpfulCount += 1;
        review.helpfulBy.push(userObjectId);
      }
    } else {
      if (hasVoted) {
        review.helpfulCount -= 1;
        review.helpfulBy = review.helpfulBy.filter(id => id.toString() !== userObjectId);
      }
    }
    
    await review.save();
    res.json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating helpful count", error: err.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const updated = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    // Update product stats
    if (updated && updated.product) {
      await updateProductStats(updated.product);
    }
    
    res.json({ success: true, updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating review", error: err.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });
    
    const productId = review.product;
    await Review.findByIdAndDelete(req.params.id);
    
    // Update product stats
    if (productId) {
      await updateProductStats(productId);
    }
    
    res.json({ success: true, message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting review", error: err.message });
  }
};
