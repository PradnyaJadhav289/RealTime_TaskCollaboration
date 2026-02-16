import Task from "../models/Task.js";
import ActivityLog from "../models/ActivityLog.js";
import Board from "../models/Board.js";
import { getIO } from "../config/socket.js";

import {
  createTaskService,
  updateTaskService,
  deleteTaskService,
} from "../services/taskService.js";

// ============================
// CREATE TASK
// ============================
export const createTask = async (req, res) => {
  try {
    const board = await Board.findById(req.body.board);

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    if (board.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only the board owner can create tasks",
      });
    }

    const task = await Task.create({
      title: req.body.title,
      board: req.body.board,
      list: req.body.list,
      createdBy: req.user._id,
    });

    const populatedTask = await Task.findById(task._id)
      .populate("createdBy", "name email")
      .populate("assignedUsers", "name email");

    res.status(201).json(populatedTask);

  } catch (error) {
    console.log("TASK CREATE ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// ============================
// GET TASKS
// ============================
export const getTasks = async (req, res) => {
  try {
    const boardId = req.params.boardId;

    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const userId = req.user._id.toString();
    const isOwner = board.owner.toString() === userId;

    const query = isOwner
      ? { board: boardId }
      : { board: boardId, assignedUsers: userId };

    const tasks = await Task.find(query)
      .sort("order")
      .populate("createdBy", "name email")
      .populate("assignedUsers", "name email");

    res.json(tasks);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================
// UPDATE TASK
// ============================
export const updateTask = async (req, res) => {
  try {
    const existingTask = await Task.findById(req.params.id);

    if (!existingTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const board = await Board.findById(existingTask.board);

    if (!board) {
      return res.status(404).json({
        message: "Board not found",
      });
    }

    const userId = req.user._id.toString();
    const isOwner = board.owner.toString() === userId;
    const isAssigned =
      Array.isArray(existingTask.assignedUsers) &&
      existingTask.assignedUsers.some(
        (u) => u.toString() === userId
      );

    // Only board owner can edit task details or assignment.
    // Assigned users may only move tasks (list/order).
    if (!isOwner) {
      if (!isAssigned) {
        return res.status(403).json({
          message:
            "Only the board owner or assigned users can move this task",
        });
      }

      const allowedKeys = ["list", "order"];
      const bodyKeys = Object.keys(req.body || {});
      const hasDisallowed = bodyKeys.some(
        (key) => !allowedKeys.includes(key)
      );

      if (hasDisallowed) {
        return res.status(403).json({
          message: "Only the board owner can edit task details",
        });
      }
    }

    const updatedTask = await updateTaskService(
      req.params.id,
      req.body
    );

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // 🔥 SOCKET EMIT (CORRECT)
    const io = getIO();

    io.to(updatedTask.board.toString())
      .emit("task_moved", updatedTask);

    res.json(updatedTask);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ============================
// DELETE TASK
// ============================
export const deleteTask = async (req, res) => {
  try {
    const existingTask = await Task.findById(req.params.id);

    if (!existingTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const board = await Board.findById(existingTask.board);

    if (!board) {
      return res.status(404).json({
        message: "Board not found",
      });
    }

    if (board.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only the board owner can delete tasks",
      });
    }

    const deletedTask = await deleteTaskService(
      req.params.id
    );

    if (!deletedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json({
      message: "Task deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ============================
// ACTIVITY LOG
// ============================
export const getBoardActivity = async (req, res) => {
  try {

    const logs = await ActivityLog.find({
      board: req.params.boardId,
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(logs);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
