import Task from "../models/Task.js";
import ActivityLog from "../models/ActivityLog.js";
import Board from "../models/Board.js";
import List from "../models/List.js";
import { getIO } from "../config/socket.js";
import { logActivity } from "../utils/activityLogger.js";

// CREATE TASK WITH ENHANCED LOGGING
export const createTask = async (req, res) => {
  try {
    const board = await Board.findById(req.body.board);
    if (!board) return res.status(404).json({ message: "Board not found" });
    
    if (board.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the board owner can create tasks" });
    }

    const task = await Task.create({
      title: req.body.title,
      description: req.body.description || "",
      board: req.body.board,
      list: req.body.list,
      createdBy: req.user._id,
      priority: req.body.priority || "medium",
      dueDate: req.body.dueDate || null,
      assignedUsers: req.body.assignedUsers || [],
    });

    const populatedTask = await Task.findById(task._id)
      .populate("createdBy", "name email")
      .populate("assignedUsers", "name email");

    // Log activity
    await logActivity({
      board: req.body.board,
      user: req.user._id,
      action: "created task",
      task: task._id,
      meta: { title: task.title },
    });

    // Emit socket event
    const io = getIO();
    io.to(req.body.board.toString()).emit("task_created", populatedTask);
    io.to(req.body.board.toString()).emit("activity_updated");

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET TASKS WITH SEARCH, FILTER & PAGINATION
export const getTasks = async (req, res) => {
  try {
    const boardId = req.params.boardId;
    const {
      search,
      priority,
      status,
      assignedTo,
      listId,
      page = 1,
      limit = 100,
      sortBy = "order",
      sortOrder = "asc",
    } = req.query;

    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: "Board not found" });

    const userId = req.user._id.toString();
    const isOwner = board.owner.toString() === userId;

    // Base query
    const query = isOwner
      ? { board: boardId }
      : { board: boardId, assignedUsers: userId };

    // Apply filters
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (priority && priority !== "all") query.priority = priority;
    if (status && status !== "all") query.status = status;
    if (assignedTo && assignedTo !== "all") query.assignedUsers = assignedTo;
    if (listId && listId !== "all") query.list = listId;

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Sort
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const tasks = await Task.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .populate("createdBy", "name email")
      .populate("assignedUsers", "name email");

    const total = await Task.countDocuments(query);

    res.json({
      tasks,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        itemsPerPage: limitNum,
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE TASK WITH DETAILED ACTIVITY LOGGING
export const updateTask = async (req, res) => {
  try {
    const existingTask = await Task.findById(req.params.id);
    if (!existingTask) return res.status(404).json({ message: "Task not found" });

    const board = await Board.findById(existingTask.board);
    if (!board) return res.status(404).json({ message: "Board not found" });

    const userId = req.user._id.toString();
    const isOwner = board.owner.toString() === userId;
    const isAssigned = Array.isArray(existingTask.assignedUsers) &&
      existingTask.assignedUsers.some((u) => u.toString() === userId);

    if (!isOwner && !isAssigned) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Track changes for activity log
    const changes = [];
    if (req.body.title && req.body.title !== existingTask.title) {
      changes.push(`title to "${req.body.title}"`);
    }
    if (req.body.list && req.body.list !== existingTask.list.toString()) {
      const oldList = await List.findById(existingTask.list);
      const newList = await List.findById(req.body.list);
      changes.push(`moved from "${oldList?.title}" to "${newList?.title}"`);
    }
    if (req.body.priority && req.body.priority !== existingTask.priority) {
      changes.push(`priority to ${req.body.priority}`);
    }
    if (req.body.status && req.body.status !== existingTask.status) {
      changes.push(`status to ${req.body.status}`);
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("createdBy", "name email")
     .populate("assignedUsers", "name email");

    // Log activity
    if (changes.length > 0) {
      await logActivity({
        board: updatedTask.board,
        user: req.user._id,
        action: `updated task: ${changes.join(", ")}`,
        task: updatedTask._id,
        meta: { title: updatedTask.title },
      });
    }

    const io = getIO();
    io.to(updatedTask.board.toString()).emit("task_updated", updatedTask);
    io.to(updatedTask.board.toString()).emit("activity_updated");

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE TASK WITH LOGGING
export const deleteTask = async (req, res) => {
  try {
    const existingTask = await Task.findById(req.params.id);
    if (!existingTask) return res.status(404).json({ message: "Task not found" });

    const board = await Board.findById(existingTask.board);
    if (board.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only owner can delete" });
    }

    const taskTitle = existingTask.title;
    const taskBoard = existingTask.board;

    await Task.findByIdAndDelete(req.params.id);

    await logActivity({
      board: taskBoard,
      user: req.user._id,
      action: "deleted task",
      meta: { title: taskTitle },
    });

    const io = getIO();
    io.to(taskBoard.toString()).emit("task_deleted", req.params.id);
    io.to(taskBoard.toString()).emit("activity_updated");

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET BOARD ACTIVITY WITH PAGINATION
export const getBoardActivity = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const logs = await ActivityLog.find({ board: req.params.boardId })
      .populate("user", "name email")
      .populate("task", "title")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ActivityLog.countDocuments({ board: req.params.boardId });

    res.json({
      data: logs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// BULK UPDATE FOR DRAG & DROP
export const bulkUpdateTasksOrder = async (req, res) => {
  try {
    const { tasks } = req.body;
    
    const bulkOps = tasks.map((task) => ({
      updateOne: {
        filter: { _id: task._id },
        update: { order: task.order, list: task.list },
      },
    }));

    await Task.bulkWrite(bulkOps);

    if (tasks.length > 0) {
      const firstTask = await Task.findById(tasks[0]._id);
      if (firstTask) {
        const io = getIO();
        io.to(firstTask.board.toString()).emit("tasks_reordered");
      }
    }

    res.json({ message: "Tasks order updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET TASK STATISTICS
export const getTaskStatistics = async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId);
    if (!board) return res.status(404).json({ message: "Board not found" });

    const isOwner = board.owner.toString() === req.user._id.toString();
    const query = isOwner
      ? { board: req.params.boardId }
      : { board: req.params.boardId, assignedUsers: req.user._id };

    const [total, byPriority, byStatus, overdue] = await Promise.all([
      Task.countDocuments(query),
      Task.aggregate([{ $match: query }, { $group: { _id: "$priority", count: { $sum: 1 } } }]),
      Task.aggregate([{ $match: query }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
      Task.countDocuments({ ...query, dueDate: { $lt: new Date() }, status: { $ne: "done" } }),
    ]);

    res.json({
      total,
      byPriority: byPriority.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {}),
      byStatus: byStatus.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {}),
      overdue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};