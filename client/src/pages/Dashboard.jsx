import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { logout } from "../features/auth/authSlice";
import "./Dashboard.css";

export default function Dashboard() {
  const { userInfo } = useSelector((state) => state.auth);

  const [boards, setBoards] = useState([]);
  const [title, setTitle] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // =========================
  // FETCH BOARDS
  // =========================
  const fetchBoards = async () => {
    try {
      const res = await axios.get("/boards", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      setBoards(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // CREATE BOARD
  // =========================
  const createBoard = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      const res = await axios.post(
        "/boards",
        { title },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      setBoards((prev) => [...prev, res.data]);
      setTitle("");
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="dashboard-header">
        <h2>Task Collaboration Dashboard</h2>

        <div className="user-box">
          <span>Welcome, {userInfo?.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* CREATE BOARD */}
      <form className="create-board" onSubmit={createBoard}>
        <input
          placeholder="Enter board name..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Create Board</button>
      </form>

      {/* BOARDS SECTION */}
      <h3>Your Boards</h3>

      <div className="board-grid">
        {boards.length === 0 ? (
          <p>No boards yet. Create one!</p>
        ) : (
          boards.map((board) => (
            <div
              key={board._id}
              className="board-card"
              onClick={() => navigate(`/board/${board._id}`)}
            >
              <h4>{board.title}</h4>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
