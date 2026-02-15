import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    list: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
      required: true,
    },
    createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
}
,

    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },

    assignedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    status: {
      type: String,
      enum: ["todo", "doing", "done"],
      default: "todo",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    dueDate: {
      type: Date,
    },

    order: {
      type: Number,
      default: 0, // drag & drop position
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Task", taskSchema);
