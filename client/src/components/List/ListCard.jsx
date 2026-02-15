import AddTask from "../Task/AddTask";
import TaskCard from "../Task/TaskCard";
import ListHeader from "./ListHeader";

export default function ListCard({
  list,
  tasks = [],
  boardId,
  onTaskAdded,
}) {
  return (
    <div className="list-card">

      <ListHeader title={list.title} />

      {/* TASKS */}
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} />
      ))}

      {/* ADD TASK */}
      <AddTask
        listId={list._id}
        boardId={boardId}
        onTaskAdded={onTaskAdded}
      />

    </div>
  );
}
