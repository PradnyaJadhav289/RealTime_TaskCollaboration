import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteTaskAPI } from "../../api/taskApi";
import { deleteTask } from "../../features/task/taskSlice";
import TaskModal from "./TaskModal";

export default function TaskCard({ task }) {
  const [showModal, setShowModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const handleDelete = async () => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await deleteTaskAPI(task._id, userInfo.token);
      dispatch(deleteTask(task._id));
    } catch (error) {
      console.error("Delete task error:", error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#eb5a46";
      case "medium":
        return "#f2d600";
      case "low":
        return "#61bd4f";
      default:
        return "#c4c9cc";
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        style={{
          background: "white",
          padding: "10px 12px",
          marginBottom: "8px",
          borderRadius: "6px",
          boxShadow: "0 1px 2px rgba(9,30,66,.13)",
          cursor: "pointer",
          position: "relative",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 4px 8px rgba(9,30,66,.25)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 1px 2px rgba(9,30,66,.13)";
        }}
      >
        {/* Priority Badge */}
        {task.priority && (
          <div
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: getPriorityColor(task.priority),
            }}
          />
        )}

        {/* Task Title */}
        <div style={{ fontSize: "14px", marginBottom: "8px" }}>
          {task.title}
        </div>

        {/* Task Meta */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            fontSize: "12px",
            color: "#5e6c84",
          }}
        >
          {task.dueDate && (
            <div
              style={{
                background: isOverdue ? "#eb5a46" : "#dfe1e6",
                color: isOverdue ? "white" : "#172b4d",
                padding: "2px 8px",
                borderRadius: "4px",
                fontSize: "11px",
              }}
            >
              📅 {new Date(task.dueDate).toLocaleDateString()}
            </div>
          )}

          {task.description && (
            <span title="This card has a description">📝</span>
          )}
        </div>
      </div>

      {/* Task Modal */}
      {showModal && (
        <TaskModal
          task={task}
          onClose={() => setShowModal(false)}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
