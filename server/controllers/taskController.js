import {
  createTaskService,
  getTasksByBoardService,
  updateTaskService,
  deleteTaskService,
} from "../services/taskService.js";
import { getIO } from "../config/socket.js";


// ============================
// CREATE TASK
// ============================
export const createTask = async (req, res) => {
  try {
    const task = await createTaskService(req.body);

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// ============================
// GET TASKS (BY BOARD)
// ============================
export const getTasks = async (req, res) => {
  try {
    const tasks = await getTasksByBoardService(req.params.boardId);

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// ============================
// UPDATE TASK
// ============================
export const updateTask = async (req, res) => {
    const io = getIO();

io.to(updatedTask.board.toString()).emit("task_moved", updatedTask);

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
    const deletedTask = await deleteTaskService(req.params.id);

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
