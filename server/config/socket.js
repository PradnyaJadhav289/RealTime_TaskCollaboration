import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  const rawClientUrl = (process.env.CLIENT_URL || "").replace(/\/$/, "");

  const allowedOrigins = [
    rawClientUrl,
    "http://localhost:5173",
    "http://localhost:3000",
  ].filter(Boolean);

  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        const cleanOrigin = origin.replace(/\/$/, "");

        if (allowedOrigins.includes(cleanOrigin)) {
          return callback(null, true);
        }

        // Allow all Vercel preview URLs
        if (cleanOrigin.endsWith(".vercel.app")) {
          return callback(null, true);
        }

        console.warn(`❌ Socket CORS blocked: ${origin}`);
        callback(new Error(`Socket CORS blocked: ${origin}`));
      },
      methods: ["GET", "POST"],
      credentials: true,
    },
    // Render free tier goes to sleep — these settings help reconnect
    pingTimeout: 60000,
    pingInterval: 25000,
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id);

    socket.on("join_board", (boardId) => {
      socket.join(boardId);
      console.log(`Socket ${socket.id} joined board: ${boardId}`);
    });

    socket.on("leave_board", (boardId) => {
      socket.leave(boardId);
    });

    socket.on("disconnect", (reason) => {
      console.log(`❌ Socket disconnected: ${socket.id} — reason: ${reason}`);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connect error:", err.message);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};