import BoardMembers from "./BoardMembers";

export default function BoardHeader() {
  return (
    <div className="board-header">

      <h2>Project Board</h2>

      <div className="header-right">
        <BoardMembers />

        <button className="invite-btn">
          + Invite
        </button>
      </div>

    </div>
  );
}
