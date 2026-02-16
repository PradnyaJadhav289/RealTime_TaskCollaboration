import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createListAPI } from "../../api/boardApi";
import { addList } from "../../features/board/boardSlice";

export default function AddList({ boardId }) {
  const [title, setTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const newList = await createListAPI(
        {
          title,
          board: boardId,
        },
        userInfo.token
      );

      dispatch(addList(newList));
      setTitle("");
      setIsAdding(false);
    } catch (error) {
      console.error("Create list error:", error);
    }
  };

  if (!isAdding) {
    return (
      <div
        onClick={() => setIsAdding(true)}
        style={{
          minWidth: "280px",
          padding: "12px",
          background: "rgba(255, 255, 255, 0.24)",
          borderRadius: "10px",
          cursor: "pointer",
          color: "white",
          fontWeight: "500",
        }}
      >
        + Add another list
      </div>
    );
  }

  return (
    <div
      style={{
        minWidth: "280px",
        padding: "12px",
        background: "#ebecf0",
        borderRadius: "10px",
      }}
    >
      <form onSubmit={handleSubmit}>
        <input
          autoFocus
          placeholder="Enter list title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            border: "2px solid #0079bf",
            borderRadius: "4px",
            fontSize: "14px",
            marginBottom: "8px",
          }}
        />

        <div style={{ display: "flex", gap: "6px" }}>
          <button
            type="submit"
            style={{
              padding: "8px 16px",
              background: "#0079bf",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Add List
          </button>

          <button
            type="button"
            onClick={() => {
              setTitle("");
              setIsAdding(false);
            }}
            style={{
              padding: "8px 16px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "20px",
            }}
          >
            ✕
          </button>
        </div>
      </form>
    </div>
  );
}
