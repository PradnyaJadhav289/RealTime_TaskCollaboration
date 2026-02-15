import { useState } from "react";
import axios from "../../api/axios";
import { useSelector } from "react-redux";

export default function AddTask({
  listId,
  boardId,
  onTaskAdded,
}) {
  const { userInfo } = useSelector((state) => state.auth);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  // CREATE TASK
  const handleAddTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      const res = await axios.post(
        "/tasks",
        {
          title,
          list: listId,
          board: boardId,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      onTaskAdded(res.data);

      setTitle("");
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  // ========================
  // UI
  // ========================
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          border: "none",
          background: "transparent",
          color: "#4f6ef7",
          cursor: "pointer",
          marginTop: "8px",
        }}
      >
        + Add a card
      </button>
    );
  }

  return (
    <form onSubmit={handleAddTask}>
      <input
        autoFocus
        placeholder="Enter task title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          width: "100%",
          padding: "8px",
          marginTop: "8px",
        }}
      />

      <div style={{ marginTop: "8px" }}>
        <button type="submit">Add Card</button>

        <button
          type="button"
          onClick={() => setOpen(false)}
          style={{ marginLeft: "6px" }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
