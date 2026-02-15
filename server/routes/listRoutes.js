import express from "express";
import {
  createList,
  getLists,
  updateList,
  deleteList,
} from "../controllers/listController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createList);
router.get("/:boardId", protect, getLists);
router.put("/:id", protect, updateList);
router.delete("/:id", protect, deleteList);

export default router;
