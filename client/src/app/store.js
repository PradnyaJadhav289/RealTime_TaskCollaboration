import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import boardReducer from "../features/board/boardSlice";
import taskReducer from "../features/task/taskSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    board: boardReducer,
    task: taskReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
