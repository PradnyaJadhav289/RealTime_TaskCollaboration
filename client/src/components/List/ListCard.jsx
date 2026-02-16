import { useDispatch, useSelector } from "react-redux";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { deleteListAPI } from "../../api/boardApi";
import { deleteList } from "../../features/board/boardSlice";
import ListHeader from "./ListHeader";
import TaskCard from "../Task/TaskCard";
import AddTask from "../Task/AddTask";

function SortableTask({ task, canDrag }) {
  if (!canDrag) {
    return <TaskCard task={task} />;
  }

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : "auto",
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
  const { currentBoard } = useSelector((state) => state.board);

  // Make the list droppable
  const { setNodeRef, isOver } = useDroppable({
    id: list._id,
  });

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
      ref={setNodeRef}
      style={{
        minWidth: "280px",
        maxWidth: "280px",
        background: isOver ? "#e3f2fd" : "#ebecf0",
        borderRadius: "10px",
        padding: "12px",
        display: "flex",
        flexDirection: "column",
        maxHeight: "100%",
        transition: "background-color 0.2s",
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
          minHeight: "100px", // Ensure there's space to drop
        }}
      >
        <SortableContext
          items={tasks.map((task) => task._id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => {
            const isOwner =
              currentBoard?.owner &&
              userInfo?._id &&
              currentBoard.owner === userInfo._id;

            const isAssigned =
              Array.isArray(task.assignedUsers) &&
              userInfo?._id &&
              task.assignedUsers.some((u) =>
                typeof u === "string" ? u === userInfo._id : u._id === userInfo._id
              );

            const canDrag = isOwner || isAssigned;

            return (
              <SortableTask
                key={task._id}
                task={task}
                canDrag={canDrag}
              />
            );
          })}
        </SortableContext>
      </div>

      <AddTask listId={list._id} boardId={boardId} />
    </div>
  );
}