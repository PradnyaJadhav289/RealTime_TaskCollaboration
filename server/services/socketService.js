// EMIT EVENTS HELPERS

export const emitTaskCreated = (io, boardId, task) => {
  io.to(boardId).emit("task_created", task);
};

export const emitTaskUpdated = (io, boardId, task) => {
  io.to(boardId).emit("task_updated", task);
};

export const emitTaskDeleted = (io, boardId, taskId) => {
  io.to(boardId).emit("task_deleted", taskId);
};
