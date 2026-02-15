import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../../api/axios";
import ListCard from "../List/ListCard";
import "./BoardContainer.css";

export default function BoardContainer() {

  const { id } = useParams();
  const { userInfo } = useSelector((state) => state.auth);

  // ⭐ REAL LIST STATE
  const [lists, setLists] = useState([]);

  // TASK STATE
  const [tasks, setTasks] = useState([]);

  // =====================
  // FETCH LISTS FROM DB
  // =====================
  const fetchLists = async () => {
    try {
      const res = await axios.get(`/lists/${id}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      setLists(res.data);

    } catch (error) {
      console.error("Fetch lists failed", error);
    }
  };

  useEffect(() => {
    if (!userInfo) return;
    fetchLists();
  }, [id, userInfo]);

  // =====================
  // ADD TASK HANDLER
  // =====================
  const handleTaskAdded = (newTask) => {
    setTasks((prev) => [...prev, newTask]);
  };

  // =====================
  // GROUP TASKS
  // =====================
  const tasksByList = useMemo(() => {
    const grouped = {};

    lists.forEach((list) => {
      grouped[list._id] = tasks.filter(
        (task) => task.list === list._id
      );
    });

    return grouped;
  }, [tasks, lists]);

  // =====================
  // UI
  // =====================
  return (
    <div className="board-container">
      {lists.map((list) => (
        <ListCard
          key={list._id}
          list={list}
          tasks={tasksByList[list._id] || []}
          boardId={id}
          onTaskAdded={handleTaskAdded}
        />
      ))}
    </div>
  );
}
