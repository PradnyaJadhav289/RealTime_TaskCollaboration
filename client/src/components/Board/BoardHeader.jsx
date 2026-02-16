import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { inviteMemberAPI } from "../../api/boardApi";
import { setCurrentBoard } from "../../features/board/boardSlice";
import BoardMembers from "./BoardMembers";

export default function BoardHeader({ board }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState("");

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !board?._id || !userInfo?.token) return;

    try {
      setInviteLoading(true);
      setInviteError("");
      const updatedBoard = await inviteMemberAPI(
        board._id,
        inviteEmail.trim(),
        userInfo.token
      );
      dispatch(setCurrentBoard(updatedBoard));
      setInviteEmail("");
      setShowInvite(false);
    } catch (error) {
      console.error("Invite member error:", error);
      setInviteError(
        error.response?.data?.message || "Failed to invite member"
      );
    } finally {
      setInviteLoading(false);
    }
  };

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

        {!showInvite ? (
          <button
            onClick={() => setShowInvite(true)}
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
        ) : (
          <form
            onSubmit={handleInvite}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(0, 0, 0, 0.4)",
              padding: "6px 10px",
              borderRadius: "6px",
            }}
          >
            <input
              type="email"
              placeholder="Member email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              style={{
                padding: "6px 8px",
                borderRadius: "4px",
                border: "none",
                fontSize: "13px",
              }}
            />
            <button
              type="submit"
              disabled={inviteLoading}
              style={{
                background: "#61bd4f",
                border: "none",
                padding: "6px 10px",
                borderRadius: "4px",
                color: "white",
                cursor: inviteLoading ? "not-allowed" : "pointer",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              {inviteLoading ? "Inviting..." : "Invite"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowInvite(false);
                setInviteEmail("");
                setInviteError("");
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              ✕
            </button>
            {inviteError && (
              <span
                style={{
                  color: "#ffb3b3",
                  fontSize: "12px",
                  marginLeft: "4px",
                }}
              >
                {inviteError}
              </span>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
