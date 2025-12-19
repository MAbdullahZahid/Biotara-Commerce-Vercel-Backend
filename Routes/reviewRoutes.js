import express from "express";
import {
    addReview,
    deleteReview,
    getAllReviews,
    getProductReviewStats,
    getReview,
    getReviewsByProductHandle,
    getReviewsByUser,
    markReviewHelpful,
    updateReview
} from "../controllers/reviewController.js";

const router = express.Router();

router.post("/add", addReview);
router.get("/all", getAllReviews);
router.get("/product/:handle", getReviewsByProductHandle);
router.get("/product/:handle/stats", getProductReviewStats);
router.get("/user/:userId", getReviewsByUser);
router.post("/:id/helpful", markReviewHelpful);
router.get("/:id", getReview);
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);

export default router;
