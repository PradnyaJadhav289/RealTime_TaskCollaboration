import mongoose from "mongoose";

const listSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },

    order: {
      type: Number,
      default: 0, // drag-drop position
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("List", listSchema);
