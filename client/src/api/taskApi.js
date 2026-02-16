import axios from "./axios";

// GET TASKS BY BOARD
export const getTasksAPI = async (boardId, token) => {
  const res = await axios.get(`/tasks/${boardId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// CREATE TASK
export const createTaskAPI = async (data, token) => {
  const res = await axios.post("/tasks", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// UPDATE TASK
export const updateTaskAPI = async (taskId, data, token) => {
  const res = await axios.put(`/tasks/${taskId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// DELETE TASK
export const deleteTaskAPI = async (taskId, token) => {
  const res = await axios.delete(`/tasks/${taskId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// GET BOARD ACTIVITY
export const getBoardActivityAPI = async (boardId, token) => {
  const res = await axios.get(`/tasks/activity/${boardId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
