import express from "express";
import {
    addProduct,
    deleteProduct,
    getAllProducts,
    getOrCreateProductByHandle,
    getProduct,
    searchProducts,
    updateProduct
} from "../controllers/productController.js";

import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/all", getAllProducts);
router.get("/search", searchProducts);
router.post("/sync", getOrCreateProductByHandle); // For syncing with Shopify
router.get("/:id", getProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

router.post("/add", upload.single("image"), addProduct);

export default router;
