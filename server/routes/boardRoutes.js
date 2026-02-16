import express from "express";
import {
  createBoard,
  getBoards,
  getBoardById,
  deleteBoard,
  updateBoard,
  inviteMember,
} from "../controllers/boardController.js";

import protect from "../middleware/authMiddleware.js";
import { isBoardMember, isBoardOwner } from "../middleware/boardMiddleware.js";

const router = express.Router();

// PROTECTED ROUTES
router.post("/", protect, createBoard);
router.get("/", protect, getBoards);
router.get("/:id", protect, getBoardById);
router.put("/:id", protect, isBoardMember, updateBoard);
router.post("/:id/invite", protect, isBoardOwner, inviteMember);
router.delete("/:id", protect, isBoardOwner, deleteBoard);

export default router;
