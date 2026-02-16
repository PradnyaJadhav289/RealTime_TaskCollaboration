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

router.post("/", protect, createTask);
router.get("/:boardId", protect, getTasks);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);
router.post("/bulk-update", protect, bulkUpdateTasksOrder);
router.get("/activity/:boardId", protect, getBoardActivity);
router.get("/statistics/:boardId", protect, getTaskStatistics);

export default router;