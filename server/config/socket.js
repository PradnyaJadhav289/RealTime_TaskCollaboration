import {Server} from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true, // ⭐ IMPORTANT
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // JOIN BOARD ROOM
    socket.on("join_board", (boardId) => {
      socket.join(boardId);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};
