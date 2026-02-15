import Board from "../models/Board.js";

// CREATE BOARD
export const createBoard = async (req, res) => {
  try {
    const board = await Board.create({
      title: req.body.title,
      owner: req.user._id,
      members: [req.user._id],
    });

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
    const board = await Board.findById(req.params.id);

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

