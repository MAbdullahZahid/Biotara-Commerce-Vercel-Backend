import express from "express";
import upload from "../middleware/upload.js";

const router = express.Router();

// upload single image
router.post("/upload", upload.single("file"), (req, res) => {
  res.json({
    success: true,
    filePath: req.file.path,
  });
});

// upload multiple
router.post("/upload-multiple", upload.array("files", 10), (req, res) => {
  res.json({
    success: true,
    files: req.files.map(f => f.path),
  });
});

export default router;
