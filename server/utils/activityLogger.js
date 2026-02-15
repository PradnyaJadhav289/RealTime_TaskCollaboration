import ActivityLog from "../models/ActivityLog.js";

export const logActivity = async ({
  board,
  user,
  action,
  task,
  meta = {},
}) => {
  try {
    await ActivityLog.create({
      board,
      user,
      action,
      task,
      meta,
    });
  } catch (error) {
    console.error("Activity log failed:", error);
  }
};
