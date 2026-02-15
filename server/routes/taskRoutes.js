import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getBoardActivity,
} from "../controllers/taskController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createTask);
router.get("/:boardId", protect, getTasks);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);
router.get("/activity/:boardId", protect, getBoardActivity);


export default router;
