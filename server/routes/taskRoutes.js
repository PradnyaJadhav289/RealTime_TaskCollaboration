import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getBoardActivity,
  bulkUpdateTasksOrder,
  getTaskStatistics,
} from "../controllers/taskController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// SPECIFIC routes MUST come before generic /:id routes
// Otherwise /:boardId will catch /bulk-update, /activity/xxx, /statistics/xxx
router.post("/bulk-update", protect, bulkUpdateTasksOrder);
router.get("/activity/:boardId", protect, getBoardActivity);
router.get("/statistics/:boardId", protect, getTaskStatistics);

// Generic routes
router.post("/", protect, createTask);
router.get("/:boardId", protect, getTasks);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);

export default router;