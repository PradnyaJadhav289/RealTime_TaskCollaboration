import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

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

    if (!title) return;

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

      setBoards([...boards, res.data]);
      setTitle("");
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const logoutHandler = () => {
    dispatch(logout());
    navigate("/login");
  };

  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {
    fetchBoards();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>

      {/* USER INFO */}
      <p>Welcome, {userInfo?.name}</p>

      <button onClick={logoutHandler}>Logout</button>

      <hr />

      {/* CREATE BOARD */}
      <form onSubmit={createBoard}>
        <input
          type="text"
          placeholder="Enter board name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Create Board</button>
      </form>

      <hr />

      {/* BOARD LIST */}
      <h3>Your Boards</h3>

      {boards.length === 0 ? (
        <p>No boards found</p>
      ) : (
        boards.map((board) => (
          <div
            key={board._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginTop: "10px",
              cursor: "pointer",
            }}
            onClick={() => navigate(`/board/${board._id}`)}
          >
            {board.title}
          </div>
        ))
      )}
    </div>
  );
}
