import Task from "../models/Task.js";
import ActivityLog from "../models/ActivityLog.js";
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
    const task = await Task.create({
      title: req.body.title,
      board: req.body.board,
      list: req.body.list,
      createdBy: req.user._id,
    });

    res.status(201).json(task);

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

    const tasks = await Task.find({
      board: boardId,
    });

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
