import { createSlice } from "@reduxjs/toolkit";

const taskSlice = createSlice({
  name: "task",
  initialState: {
    tasks: [],
    selectedTask: null,
    loading: false,
    error: null,
  },
  reducers: {
    // LOADING
    setTasksLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    
    setTasksSuccess: (state, action) => {
      state.tasks = action.payload;
      state.loading = false;
    },
    
    setTasksError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    
    // ADD TASK
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    
    // UPDATE TASK
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(
        (t) => t._id === action.payload._id
      );
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
      if (state.selectedTask?._id === action.payload._id) {
        state.selectedTask = action.payload;
      }
    },
    
    // DELETE TASK
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(
        (t) => t._id !== action.payload
      );
      if (state.selectedTask?._id === action.payload) {
        state.selectedTask = null;
      }
    },
    
    // SELECTED TASK
    setSelectedTask: (state, action) => {
      state.selectedTask = action.payload;
    },
    
    clearSelectedTask: (state) => {
      state.selectedTask = null;
    },
    
    // MOVE TASK (Drag & Drop) with reordering
    moveTask: (state, action) => {
      const { taskId, newListId, overTaskId } = action.payload;

      const fromIndex = state.tasks.findIndex((t) => t._id === taskId);
      const toIndex = state.tasks.findIndex((t) => t._id === overTaskId);

      if (fromIndex === -1 || toIndex === -1) return;

      const [movedTask] = state.tasks.splice(fromIndex, 1);
      movedTask.list = newListId;

      const insertIndex = fromIndex < toIndex ? toIndex - 1 : toIndex;
      state.tasks.splice(insertIndex, 0, movedTask);
    },
    
    clearTasks: (state) => {
      state.tasks = [];
      state.selectedTask = null;
    },
  },
});

export const {
  setTasksLoading,
  setTasksSuccess,
  setTasksError,
  addTask,
  updateTask,
  deleteTask,
  setSelectedTask,
  clearSelectedTask,
  moveTask,
  clearTasks,
} = taskSlice.actions;

export default taskSlice.reducer;
