import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getTasksAPI } from "../../api/taskApi";
import { setTasksSuccess } from "../../features/task/taskSlice";
import { getListsAPI } from "../../api/boardApi";
import { setLists, addList } from "../../features/board/boardSlice";
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

  // Handle list added
  const handleListAdded = (newList) => {
    dispatch(addList(newList));
  };

  if (loading) {
    return (
      <div className="board-container">
        <div style={{ padding: "20px", color: "white" }}>Loading board...</div>
      </div>
    );
  }

  return (
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
        <AddList boardId={id} onListAdded={handleListAdded} />
      </div>
    </div>
  );
}
