import express from "express";
import {
  addUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser
} from "../controllers/userController.js";

const router = express.Router();

router.post("/add", addUser);
router.get("/all", getAllUsers);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
