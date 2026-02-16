import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getBoardByIdAPI } from "../api/boardApi";
import { setCurrentBoard } from "../features/board/boardSlice";
import BoardHeader from "../components/Board/BoardHeader";
import BoardContainer from "../components/Board/BoardContainer";
import ActivityFeed from "../components/Board/ActivityFeed";
import "./BoardPage.css";

export default function BoardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { currentBoard } = useSelector((state) => state.board);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoard = async () => {
      if (!userInfo) return;

      try {
        const board = await getBoardByIdAPI(id, userInfo.token);
        dispatch(setCurrentBoard(board));
        setLoading(false);
      } catch (error) {
        console.error("Fetch board error:", error);
        navigate("/dashboard");
      }
    };

    fetchBoard();
  }, [id, userInfo, dispatch, navigate]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading board...
      </div>
    );
  }

  return (
    <div className="board-page">
      <BoardHeader board={currentBoard} />

      <div className="board-layout">
        <BoardContainer />
        <ActivityFeed boardId={id} />
      </div>
    </div>
  );
}
