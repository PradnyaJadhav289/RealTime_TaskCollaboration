import { createSlice } from "@reduxjs/toolkit";

const boardSlice = createSlice({
  name: "board",
  initialState: {
    boards: [],
    currentBoard: null,
    lists: [],
    loading: false,
    error: null,
  },
  reducers: {
    // BOARDS
    setBoardsLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setBoardsSuccess: (state, action) => {
      state.boards = action.payload;
      state.loading = false;
    },
    setBoardsError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    
    // CURRENT BOARD
    setCurrentBoard: (state, action) => {
      state.currentBoard = action.payload;
    },
    
    // ADD BOARD
    addBoard: (state, action) => {
      state.boards.push(action.payload);
    },
    
    // UPDATE BOARD
    updateBoard: (state, action) => {
      const index = state.boards.findIndex(
        (b) => b._id === action.payload._id
      );
      if (index !== -1) {
        state.boards[index] = action.payload;
      }
      if (state.currentBoard?._id === action.payload._id) {
        state.currentBoard = action.payload;
      }
    },
    
    // DELETE BOARD
    deleteBoard: (state, action) => {
      state.boards = state.boards.filter(
        (b) => b._id !== action.payload
      );
    },
    
    // LISTS
    setLists: (state, action) => {
      state.lists = action.payload;
    },
    
    addList: (state, action) => {
      state.lists.push(action.payload);
    },
    
    updateList: (state, action) => {
      const index = state.lists.findIndex(
        (l) => l._id === action.payload._id
      );
      if (index !== -1) {
        state.lists[index] = action.payload;
      }
    },
    
    deleteList: (state, action) => {
      state.lists = state.lists.filter(
        (l) => l._id !== action.payload
      );
    },
    
    clearBoardState: (state) => {
      state.currentBoard = null;
      state.lists = [];
    },
  },
});

export const {
  setBoardsLoading,
  setBoardsSuccess,
  setBoardsError,
  setCurrentBoard,
  addBoard,
  updateBoard,
  deleteBoard,
  setLists,
  addList,
  updateList,
  deleteList,
  clearBoardState,
} = boardSlice.actions;

export default boardSlice.reducer;
