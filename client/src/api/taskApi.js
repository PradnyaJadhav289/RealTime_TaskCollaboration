import axios from "./axios";

// GET TASKS BY BOARD WITH QUERY PARAMS
export const getTasksAPI = async (boardId, token, queryParams = "") => {
  const url = queryParams
    ? `/tasks/${boardId}?${queryParams}`
    : `/tasks/${boardId}`;
    
  const res = await axios.get(url, {
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
export const getBoardActivityAPI = async (boardId, token, queryParams = "") => {
  const url = queryParams
    ? `/tasks/activity/${boardId}?${queryParams}`
    : `/tasks/activity/${boardId}`;
    
  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// BULK UPDATE TASKS ORDER
export const bulkUpdateTasksOrderAPI = async (tasks, token) => {
  const res = await axios.post("/tasks/bulk-update", { tasks }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// GET TASK STATISTICS
export const getTaskStatisticsAPI = async (boardId, token) => {
  const res = await axios.get(`/tasks/statistics/${boardId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};