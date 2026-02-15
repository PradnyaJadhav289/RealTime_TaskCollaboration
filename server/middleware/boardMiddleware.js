import Board from "../models/Board.js";

// ===============================
// CHECK BOARD MEMBER
// ===============================
export const isBoardMember = async (req, res, next) => {
  const board = await Board.findById(req.params.id || req.body.board);

  if (!board) {
    return res.status(404).json({ message: "Board not found" });
  }

  const isMember = board.members.some(
    (m) => m.toString() === req.user._id.toString()
  );

  if (!isMember) {
    return res.status(403).json({ message: "Access denied" });
  }

  next();
};

// ===============================
// CHECK BOARD OWNER
// ===============================
export const isBoardOwner = async (req, res, next) => {
  const board = await Board.findById(req.params.id);

  if (board.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Only owner allowed" });
  }

  next();
};
