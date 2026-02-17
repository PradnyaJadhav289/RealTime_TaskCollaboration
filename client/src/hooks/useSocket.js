import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { addTask, updateTask, deleteTask } from "../features/task/taskSlice";

let socket = null;

export const useSocket = (boardId, userToken) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!boardId || !userToken) return;

    // Strip trailing slash from API URL
    const serverUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

    socket = io(serverUrl, {
      auth: {
        token: userToken,
      },
      withCredentials: true,
      transports: ["websocket", "polling"],
      // Reconnection settings — important for Render free tier (cold starts)
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000,
      timeout: 20000,
    });

    // Join board room after connecting
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      socket.emit("join_board", boardId);
    });

    // Task events
    socket.on("task_created", (task) => {
      dispatch(addTask(task));
    });

    socket.on("task_updated", (task) => {
      dispatch(updateTask(task));
    });

    socket.on("task_moved", (task) => {
      dispatch(updateTask(task));
    });

    socket.on("task_deleted", (taskId) => {
      dispatch(deleteTask(taskId));
    });

    socket.on("disconnect", (reason) => {
      console.warn("❌ Socket disconnected:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    socket.on("reconnect", (attempt) => {
      console.log(`🔄 Socket reconnected after ${attempt} attempts`);
      socket.emit("join_board", boardId);
    });

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.emit("leave_board", boardId);
        socket.off("task_created");
        socket.off("task_updated");
        socket.off("task_moved");
        socket.off("task_deleted");
        socket.off("connect");
        socket.off("disconnect");
        socket.off("connect_error");
        socket.off("reconnect");
        socket.disconnect();
        socket = null;
      }
    };
  }, [boardId, userToken, dispatch]);

  return socket;
};

export default useSocket;