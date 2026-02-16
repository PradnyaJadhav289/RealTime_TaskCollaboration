import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { getTasksAPI, updateTaskAPI } from "../../api/taskApi";
import { setTasksSuccess, moveTask } from "../../features/task/taskSlice";
import { getListsAPI } from "../../api/boardApi";
import { setLists } from "../../features/board/boardSlice";
import useSocket from "../../hooks/useSocket";
import ListCard from "../List/ListCard";
import AddList from "../List/AddList";
import "./BoardContainer.css";

export default function BoardContainer() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { lists } = useSelector((state) => state.board);
  const { tasks } = useSelector((state) => state.task);

  const [loading, setLoading] = useState(true);

  // Initialize socket connection for real-time updates
  useSocket(id, userInfo?.token);

  // Fetch lists and tasks
  useEffect(() => {
    const fetchData = async () => {
      if (!userInfo) return;

      try {
        setLoading(true);

        // Fetch lists
        const listsData = await getListsAPI(id, userInfo.token);
        dispatch(setLists(listsData.data || listsData));

        // Fetch tasks
        const tasksData = await getTasksAPI(id, userInfo.token);
        dispatch(setTasksSuccess(tasksData.data || tasksData));

        setLoading(false);
      } catch (error) {
        console.error("Fetch error:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id, userInfo, dispatch]);

  // Group tasks by list
  const getTasksByList = (listId) => {
    return tasks.filter((task) => task.list === listId);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || !active) return;
    if (active.id === over.id) return;

    const activeTask = tasks.find((t) => t._id === active.id);
    const overTask = tasks.find((t) => t._id === over.id);

    if (!activeTask || !overTask) return;

    const newListId = overTask.list;

    // Optimistic UI update: move in front of the "over" task
    dispatch(
      moveTask({
        taskId: activeTask._id,
        newListId,
        overTaskId: overTask._id,
      })
    );

    // Persist change to server (only list is stored on backend right now)
    try {
      if (!userInfo?.token) return;
      await updateTaskAPI(activeTask._id, { list: newListId }, userInfo.token);
    } catch (error) {
      console.error("Move task error:", error);
    }
  };

  if (loading) {
    return (
      <div className="board-container">
        <div style={{ padding: "20px", color: "white" }}>Loading board...</div>
      </div>
    );
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="board-container">
        {lists.map((list) => (
          <ListCard
            key={list._id}
            list={list}
            tasks={getTasksByList(list._id)}
            boardId={id}
          />
        ))}

        {/* ADD NEW LIST */}
        <div className="add-list-container">
          <AddList boardId={id} />
        </div>
      </div>
    </DndContext>
  );
}
