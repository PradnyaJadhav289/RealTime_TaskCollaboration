import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { addTask, updateTask, deleteTask } from "../features/task/taskSlice";

let socket = null;

export const useSocket = (boardId, userToken) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!boardId || !userToken) return;

    // Initialize socket connection
    socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || "http://localhost:5000", {
      auth: {
        token: userToken,
      },
      withCredentials: true,
    });

    // Join board room
    socket.emit("join_board", boardId);

    // Listen for task events
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

    // Connection events
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    // Cleanup
    return () => {
      if (socket) {
        socket.off("task_created");
        socket.off("task_updated");
        socket.off("task_moved");
        socket.off("task_deleted");
        socket.off("connect");
        socket.off("disconnect");
        socket.off("connect_error");
        socket.disconnect();
        socket = null;
      }
    };
  }, [boardId, userToken, dispatch]);

  return socket;
};

export default useSocket;
