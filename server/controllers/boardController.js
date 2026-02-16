import Board from "../models/Board.js";
import List from "../models/List.js";


// CREATE BOARD
// CREATE BOARD
export const createBoard = async (req, res) => {
  try {
    // 1️⃣ Create board
    const board = await Board.create({
      title: req.body.title,
      owner: req.user._id,
      members: [req.user._id],
    });

    // 2️⃣ AUTO CREATE DEFAULT LISTS
    const defaultLists = ["Todo", "Doing", "Done"];

    await Promise.all(
      defaultLists.map((title, index) =>
        List.create({
          title,
          board: board._id,
          order: index,
        })
      )
    );

    res.status(201).json(board);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET ALL BOARDS (USER)
export const getBoards = async (req, res) => {
  try {
    const boards = await Board.find({
      members: req.user._id,
    });

    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE BOARD
export const getBoardById = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id).populate(
      "members",
      "name email"
    );

    res.json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE BOARD
export const deleteBoard = async (req, res) => {
  try {
    await Board.findByIdAndDelete(req.params.id);

    res.json({ message: "Board deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE BOARD
export const updateBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // UPDATE FIELDS (only if provided)
    board.title = req.body.title || board.title;
    board.description =
      req.body.description || board.description;

    // OPTIONAL: update members
    if (req.body.members) {
      board.members = req.body.members;
    }

    const updatedBoard = await board.save();

    res.json(updatedBoard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// INVITE MEMBER BY EMAIL
export const inviteMember = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const user = await (await import("../models/User.js")).default.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadyMember = board.members.some(
      (m) => m.toString() === user._id.toString()
    );

    if (!alreadyMember) {
      board.members.push(user._id);
      await board.save();
    }

    const populatedBoard = await Board.findById(board._id).populate(
      "members",
      "name email"
    );

    res.json(populatedBoard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

