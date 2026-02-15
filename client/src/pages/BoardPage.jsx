import BoardHeader from "../components/Board/BoardHeader";
import BoardContainer from "../components/Board/BoardContainer";
import ActivityFeed from "../components/Board/ActivityFeed.jsx";

export default function BoardPage() {
  return (
    <div className="board-page">

      {/* HEADER */}
      <BoardHeader />

      {/* MAIN LAYOUT */}
      <div className="board-layout">

        {/* LEFT → BOARD */}
        <BoardContainer />

        {/* RIGHT → ACTIVITY */}
        <ActivityFeed />

      </div>
    </div>
  );
}
