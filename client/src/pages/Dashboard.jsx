import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getBoardsAPI, createBoardAPI } from "../api/boardApi";
import { setBoardsSuccess, addBoard } from "../features/board/boardSlice";
import { logout } from "../features/auth/authSlice";
import "./Dashboard.css";

export default function Dashboard() {
  const { userInfo } = useSelector((state) => state.auth);
  const { boards } = useSelector((state) => state.board);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoards = async () => {
      if (!userInfo) return;

      try {
        const data = await getBoardsAPI(userInfo.token);
        dispatch(setBoardsSuccess(data));
        setLoading(false);
      } catch (error) {
        console.error("Fetch boards error:", error);
        setLoading(false);
      }
    };

    fetchBoards();
  }, [userInfo, dispatch]);

  const createBoard = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const newBoard = await createBoardAPI({ title }, userInfo.token);
      dispatch(addBoard(newBoard));
      setTitle("");
    } catch (error) {
      console.error("Create board error:", error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div style={{ textAlign: "center", padding: "40px" }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2>📋 Task Boards</h2>
          <p style={{ color: "#5e6c84", marginTop: "4px" }}>
            Welcome back, {userInfo?.name}!
          </p>
        </div>

        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <form className="create-board" onSubmit={createBoard}>
        <input
          placeholder="Enter board name..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">+ Create Board</button>
      </form>

      <h3 style={{ marginBottom: "16px", color: "#172b4d" }}>Your Boards</h3>

      <div className="board-grid">
        {boards.length === 0 ? (
          <div className="empty-state">
            <p>No boards yet. Create your first board to get started!</p>
          </div>
        ) : (
          boards.map((board) => (
            <div
              key={board._id}
              className="board-card"
              onClick={() => navigate(`/board/${board._id}`)}
            >
              <h4>{board.title}</h4>
              <p className="board-date">
                Created {new Date(board.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
