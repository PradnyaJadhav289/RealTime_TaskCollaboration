import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      required: true,
      // Example: "moved task", "created task"
    },

    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },

    meta: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ActivityLog", activityLogSchema);
