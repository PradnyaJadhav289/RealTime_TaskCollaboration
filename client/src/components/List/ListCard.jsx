import { useDroppable } from "@dnd-kit/core";
import TaskCard from "../Task/TaskCard";

export default function ListCard({ list, tasks }) {
  const { setNodeRef, isOver } = useDroppable({
    id: list._id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        minWidth: "260px",
        background: isOver ? "#e6f0ff" : "#f4f5f7",
        padding: "12px",
        borderRadius: "8px",
      }}
    >
      <h4>{list.title}</h4>

      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} />
      ))}
    </div>
  );
}
