import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import { getTasksAPI, updateTaskAPI } from "../../api/taskApi";
import { setTasksSuccess, moveTask } from "../../features/task/taskSlice";
import { getListsAPI } from "../../api/boardApi";
import { setLists } from "../../features/board/boardSlice";
import useSocket from "../../hooks/useSocket";
import ListCard from "../List/ListCard";
import AddList from "../List/AddList";
import SearchAndFilter from "./SearchAndFilter";
import TaskCard from "../Task/TaskCard";
import "./BoardContainer.css";

export default function BoardContainer() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { lists } = useSelector((state) => state.board);
  const { tasks } = useSelector((state) => state.task);

  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    priority: "all",
    status: "all",
    assignedTo: "all",
    listId: "all",
  });

  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    priority: "all",
    status: "all",
    assignedTo: "all",
    listId: "all",
  });

  useSocket(id, userInfo?.token);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  useEffect(() => {
    fetchData();
  }, [id, userInfo, appliedFilters]);

  const fetchData = async () => {
    if (!userInfo) return;

    try {
      setLoading(true);

      const listsData = await getListsAPI(id, userInfo.token);
      dispatch(setLists(listsData.data || listsData));

      const queryParams = new URLSearchParams();
      Object.entries(appliedFilters).forEach(([key, value]) => {
        if (value && value !== "all" && value !== "") {
          queryParams.append(key, value);
        }
      });

      const tasksData = await getTasksAPI(id, userInfo.token, queryParams.toString());
      const tasksList = tasksData.tasks || tasksData.data || tasksData;
      dispatch(setTasksSuccess(Array.isArray(tasksList) ? tasksList : []));

      setLoading(false);
    } catch (error) {
      console.error("Fetch error:", error);
      setLoading(false);
    }
  };

  // Fix: accept optional overrideFilters to avoid stale state from child
  const applyFilters = (overrideFilters) => {
    setAppliedFilters(overrideFilters || { ...filters });
  };

  const getTasksByList = (listId) => {
    return tasks
      .filter((task) => {
        const taskListId = task.list?._id || task.list;
        return taskListId === listId;
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || !active || active.id === over.id) return;

    const activeTask = tasks.find((t) => t._id === active.id);

    let targetListId;
    const overTask = tasks.find((t) => t._id === over.id);

    if (overTask) {
      targetListId = overTask.list?._id || overTask.list;
    } else {
      targetListId = over.id;
    }

    if (!activeTask || !targetListId) return;

    dispatch(
      moveTask({
        taskId: activeTask._id,
        newListId: targetListId,
        overTaskId: overTask?._id || null,
      })
    );

    try {
      await updateTaskAPI(activeTask._id, { list: targetListId }, userInfo.token);
    } catch (error) {
      console.error("Move task error:", error);
      fetchData();
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const activeTask = activeId ? tasks.find((t) => t._id === activeId) : null;

  if (loading) {
    return (
      <div className="board-container">
        <div style={{ padding: "20px", color: "white" }}>Loading board...</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <SearchAndFilter
        filters={filters}
        setFilters={setFilters}
        applyFilters={applyFilters}
        lists={lists}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="board-container">
          {lists.map((list) => (
            <ListCard
              key={list._id}
              list={list}
              tasks={getTasksByList(list._id)}
              boardId={id}
            />
          ))}

          <div className="add-list-container">
            <AddList boardId={id} />
          </div>
        </div>

        <DragOverlay>
          {activeTask ? (
            <div style={{ opacity: 0.9, transform: "rotate(3deg)", cursor: "grabbing" }}>
              <TaskCard task={activeTask} isDragging={true} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}