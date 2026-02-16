import { useNavigate } from "react-router-dom";
import BoardMembers from "./BoardMembers";

export default function BoardHeader({ board }) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        background: "rgba(0, 0, 0, 0.24)",
        padding: "12px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Left Side */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            background: "rgba(255, 255, 255, 0.3)",
            border: "none",
            padding: "8px 12px",
            borderRadius: "4px",
            color: "white",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          ← Back
        </button>

        <h2
          style={{
            margin: 0,
            color: "white",
            fontSize: "20px",
            fontWeight: "700",
          }}
        >
          {board?.title || "Board"}
        </h2>

        {board?.description && (
          <span
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: "14px",
            }}
          >
            {board.description}
          </span>
        )}
      </div>

      {/* Right Side */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <BoardMembers members={board?.members || []} />

        <button
          style={{
            background: "rgba(255, 255, 255, 0.3)",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            color: "white",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          + Invite
        </button>
      </div>
    </div>
  );
}
