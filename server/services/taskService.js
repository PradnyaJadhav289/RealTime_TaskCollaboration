import Task from "../models/Task.js";

// CREATE TASK
export const createTaskService = async (taskData) => {
  const task = await Task.create(taskData);
  return task;
};

// GET TASKS OF BOARD
export const getTasksByBoardService = async (boardId) => {
  return await Task.find({ board: boardId })
    .populate("assignedUsers", "name email");
};

// UPDATE TASK
export const updateTaskService = async (taskId, updates) => {
  const task = await Task.findByIdAndUpdate(
    taskId,
    updates,
    { new: true }
  );

  return task;
};

// DELETE TASK
export const deleteTaskService = async (taskId) => {
  return await Task.findByIdAndDelete(taskId);
};
