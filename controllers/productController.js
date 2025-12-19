import fs from "fs";
import Product from "../models/Product.js";

export const addProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      image: req.file ? req.file.path : null
    };

    const product = await Product.create(productData);

    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching products", error: err.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching product", error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating product", error: err.message });
  }
};



export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ success: false, message: "Not found" });

    // Optional cleanup
    if (product.image) {
      fs.unlink(product.image, (err) => {
        if (err) console.log("Unable to delete image:", err);
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Product deleted & image cleaned" });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


export const searchProducts = async (req, res) => {
  try {
    const query = req.query.q || ""; 

    const results = await Product.find({
      title: { $regex: query, $options: "i" }
    });

    res.json({ success: true, results });
  } catch (err) {
    res.status(500).json({ success: false, message: "Search error" });
  }
};

// Get or create product by handle (for syncing with Shopify)
export const getOrCreateProductByHandle = async (req, res) => {
  try {
    const { handle, title, image, shopifyProductId } = req.body;
    
    let product = await Product.findOne({ handle });
    
    if (!product) {
      product = await Product.create({
        handle,
        title,
        image,
        shopifyProductId
      });
    } else {
      // Update product info if exists
      product.title = title;
      product.image = image;
      if (shopifyProductId) product.shopifyProductId = shopifyProductId;
      await product.save();
    }
    
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error with product", error: err.message });
  }
};

