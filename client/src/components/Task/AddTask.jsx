import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTaskAPI } from "../../api/taskApi";
import { addTask } from "../../features/task/taskSlice";

export default function AddTask({ listId, boardId }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);
  const { currentBoard } = useSelector((state) => state.board);
  const dispatch = useDispatch();

  const isOwner =
    currentBoard?.owner &&
    userInfo?._id &&
    currentBoard.owner === userInfo._id;

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (!isOwner || !userInfo?.token) return;

    try {
      setLoading(true);
      const newTask = await createTaskAPI(
        {
          title,
          list: listId,
          board: boardId,
        },
        userInfo.token
      );

      dispatch(addTask(newTask));
      setTitle("");
      setOpen(false);
      setLoading(false);
    } catch (error) {
      console.error("Create task error:", error);
      setLoading(false);
    }
  };

  if (!isOwner) {
    return null;
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          width: "100%",
          padding: "8px",
          border: "none",
          background: "transparent",
          color: "#5e6c84",
          cursor: "pointer",
          textAlign: "left",
          borderRadius: "4px",
          fontSize: "14px",
        }}
        onMouseEnter={(e) => {
          e.target.style.background = "#dfe1e6";
          e.target.style.color = "#172b4d";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "transparent";
          e.target.style.color = "#5e6c84";
        }}
      >
        + Add a card
      </button>
    );
  }

  return (
    <form onSubmit={handleAddTask}>
      <textarea
        autoFocus
        placeholder="Enter a title for this card..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          width: "100%",
          padding: "8px 12px",
          border: "none",
          borderRadius: "4px",
          fontSize: "14px",
          resize: "none",
          minHeight: "70px",
          boxShadow: "0 1px 0 rgba(9,30,66,.13)",
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleAddTask(e);
          }
        }}
      />

      <div style={{ marginTop: "8px", display: "flex", gap: "6px" }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "8px 16px",
            background: "#0079bf",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "14px",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Adding..." : "Add Card"}
        </button>

        <button
          type="button"
          onClick={() => {
            setTitle("");
            setOpen(false);
          }}
          style={{
            padding: "8px 12px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "20px",
            color: "#5e6c84",
          }}
        >
          ✕
        </button>
      </div>
    </form>
  );
}
