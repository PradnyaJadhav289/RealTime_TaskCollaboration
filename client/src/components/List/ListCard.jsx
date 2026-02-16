import { useDispatch, useSelector } from "react-redux";
import { deleteListAPI } from "../../api/boardApi";
import { deleteList } from "../../features/board/boardSlice";
import ListHeader from "./ListHeader";
import TaskCard from "../Task/TaskCard";
import AddTask from "../Task/AddTask";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableTask({ task }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} />
    </div>
  );
}

export default function ListCard({ list, tasks, boardId }) {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const handleDeleteList = async () => {
    if (!window.confirm("Delete this list?")) return;

    try {
      await deleteListAPI(list._id, userInfo.token);
      dispatch(deleteList(list._id));
    } catch (error) {
      console.error("Delete list error:", error);
    }
  };

  return (
    <div
      style={{
        minWidth: "280px",
        maxWidth: "280px",
        background: "#ebecf0",
        borderRadius: "10px",
        padding: "12px",
        display: "flex",
        flexDirection: "column",
        maxHeight: "100%",
      }}
    >
      <ListHeader
        title={list.title}
        taskCount={tasks.length}
        onDelete={handleDeleteList}
      />

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          marginBottom: "8px",
        }}
      >
        <SortableContext
          items={tasks.map((task) => task._id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <SortableTask key={task._id} task={task} />
          ))}
        </SortableContext>
      </div>

      <AddTask listId={list._id} boardId={boardId} />
    </div>
  );
}