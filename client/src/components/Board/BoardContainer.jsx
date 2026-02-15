import { useEffect, useState, useMemo } from "react";
import { DndContext } from "@dnd-kit/core";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../../api/axios";
import ListCard from "../List/ListCard";

import socket from "../../hooks/useSocket";


export default function BoardContainer() {
  const { id } = useParams();
  const { userInfo } = useSelector((state) => state.auth);

  
  const [tasks, setTasks] = useState([]);
  const [lists, setLists] = useState([
  { _id: "1", title: "Todo" },
  { _id: "2", title: "Done" },
]);


  // =========================
  // FETCH DATA
  // =========================
  const fetchLists = async () => {
    try {
      const res = await axios.get(`/lists/${id}`, {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      });

      setLists(res.data);
    } catch (error) {
      console.error("Fetch lists failed", error);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      });

      setTasks(res.data);
    } catch (error) {
      console.error("Fetch tasks failed", error);
    }
  };

  useEffect(() => {
    if (!userInfo) return;

    fetchLists();
    fetchTasks();
  }, [id, userInfo]);


  // =========================
  // SOCKET SETUP
  // =========================
  useEffect(() => {
    if (!id) return;

    socket.emit("join_board", id);

    socket.on("task_moved", (updatedTask) => {
      setTasks((prev) =>
        prev.map((task) =>
          task._id === updatedTask._id
            ? updatedTask
            : task
        )
      );
    });

    // CLEANUP
    return () => {
      socket.off("task_moved");
    };
  }, [id]);

  // =========================
  // DRAG END EVENT
  // =========================
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id;
    const newListId = over.id;

    // Save old state (rollback support)
    const oldTasks = [...tasks];

    // OPTIMISTIC UPDATE
    setTasks((prev) =>
      prev.map((task) =>
        task._id === taskId
          ? { ...task, list: newListId }
          : task
      )
    );

    // API UPDATE
    try {
      await axios.put(
        `/tasks/${taskId}`,
        { list: newListId },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
    } catch (error) {
      console.error("Drag update failed", error);

      // rollback if failed
      setTasks(oldTasks);
    }
  };

  // =========================
  // GROUP TASKS BY LIST (Optimization)
  // =========================
  const tasksByList = useMemo(() => {
    const grouped = {};
    lists.forEach((list) => {
      grouped[list._id] = tasks.filter(
        (t) => t.list === list._id
      );
    });
    return grouped;
  }, [tasks, lists]);

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div
        style={{
          display: "flex",
          gap: "20px",
          padding: "20px",
          overflowX: "auto",
        }}
      >hi
        {lists.map((list) => (
          <ListCard
            key={list._id}
            list={list}
            tasks={tasksByList[list._id] || []}
          />
        ))}
        
      </div>
     
    </DndContext>
  );
}
