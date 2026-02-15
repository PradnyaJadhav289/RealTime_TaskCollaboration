import List from "../models/List.js";

// CREATE LIST
export const createList = async (req, res) => {
  try {
    const list = await List.create(req.body);

    res.status(201).json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET LISTS BY BOARD
export const getLists = async (req, res) => {
  try {
    const lists = await List.find({
      board: req.params.boardId,
    }).sort("order");

    res.json(lists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE LIST
export const updateList = async (req, res) => {
  try {
    const list = await List.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE LIST
export const deleteList = async (req, res) => {
  try {
    await List.findByIdAndDelete(req.params.id);

    res.json({ message: "List deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
