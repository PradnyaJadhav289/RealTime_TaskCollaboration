import axios from "./axios";

// GET ALL BOARDS
export const getBoardsAPI = async (token) => {
  const res = await axios.get("/boards", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// GET SINGLE BOARD
export const getBoardByIdAPI = async (boardId, token) => {
  const res = await axios.get(`/boards/${boardId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// CREATE BOARD
export const createBoardAPI = async (data, token) => {
  const res = await axios.post("/boards", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// UPDATE BOARD
export const updateBoardAPI = async (boardId, data, token) => {
  const res = await axios.put(`/boards/${boardId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// DELETE BOARD
export const deleteBoardAPI = async (boardId, token) => {
  const res = await axios.delete(`/boards/${boardId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// GET LISTS BY BOARD
export const getListsAPI = async (boardId, token) => {
  const res = await axios.get(`/lists/${boardId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// CREATE LIST
export const createListAPI = async (data, token) => {
  const res = await axios.post("/lists", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// UPDATE LIST
export const updateListAPI = async (listId, data, token) => {
  const res = await axios.put(`/lists/${listId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// DELETE LIST
export const deleteListAPI = async (listId, token) => {
  const res = await axios.delete(`/lists/${listId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
