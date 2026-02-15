import { useState } from "react";
import axios from "../../api/axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export default function AddList({ onAdd }) {
  const [title, setTitle] = useState("");
  const { userInfo } = useSelector((state) => state.auth);
  const { id } = useParams();

  const createList = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      const res = await axios.post(
        "/lists",
        {
          title,
          board: id,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      onAdd(res.data);
      setTitle("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={createList} style={{ marginTop: "10px" }}>
      <input
        placeholder="New list..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button type="submit">Add List</button>
    </form>
  );
}
