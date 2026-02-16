import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateTaskAPI } from "../../api/taskApi";
import { updateTask } from "../../features/task/taskSlice";
import "./TaskModal.css";

export default function TaskModal({ task, onClose, onDelete }) {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { lists } = useSelector((state) => state.board);
  const { currentBoard } = useSelector((state) => state.board);

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState(task.priority || "medium");
  const [dueDate, setDueDate] = useState(
    task.dueDate ? task.dueDate.split("T")[0] : ""
  );
  const [selectedList, setSelectedList] = useState(task.list);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [assignedUserIds, setAssignedUserIds] = useState(
    task.assignedUsers || []
  );
  const isOwner =
    currentBoard?.owner &&
    userInfo?._id &&
    currentBoard.owner === userInfo._id;

  const handleSave = async () => {
    if (!isOwner) {
      setError("Only the board owner can edit this task.");
      return;
    }

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await updateTaskAPI(
        task._id,
        {
          title,
          description,
          priority,
          dueDate: dueDate || null,
          list: selectedList,
          assignedUsers: assignedUserIds,
        },
        userInfo.token
      );

      const updatedTaskData = response.data || response;
      dispatch(updateTask(updatedTaskData));
      onClose();
    } catch (error) {
      console.error("Update task error:", error);
      setError(error.response?.data?.message || "Failed to update task");
      setSaving(false);
    }
  };

  const getPriorityColor = (p) => {
    switch (p) {
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

  const isOverdue = dueDate && new Date(dueDate) < new Date();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h3>📋 Edit Task</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Title */}
        <div className="form-group">
          <label>Title *</label>
          <input
            disabled={!isOwner}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description</label>
          <textarea
            disabled={!isOwner}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a more detailed description..."
            rows="4"
          />
        </div>

        {/* Priority and Due Date Row */}
        <div className="form-row">
          <div className="form-group">
            <label>Priority</label>
            <select
              disabled={!isOwner}
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={{
                borderLeft: `4px solid ${getPriorityColor(priority)}`,
              }}
            >
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
          </div>

          <div className="form-group">
            <label>Due Date {isOverdue && <span className="overdue-badge">Overdue!</span>}</label>
            <input
              type="date"
              disabled={!isOwner}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={{
                borderColor: isOverdue ? "#eb5a46" : "#dfe1e6",
              }}
            />
          </div>
        </div>

        {/* Move to List */}
        <div className="form-group">
          <label>List</label>
          <select
            disabled={!isOwner}
            value={selectedList}
            onChange={(e) => setSelectedList(e.target.value)}
          >
            {lists.map((list) => (
              <option key={list._id} value={list._id}>
                {list.title}
                {list._id === task.list && " (current)"}
              </option>
            ))}
          </select>
        </div>

        {/* Members Section (owner only) */}
        {currentBoard?.members && isOwner && (
          <div className="form-group">
            <label>Assign Members</label>
            <div className="members-list">
              {currentBoard.members.map((member) => (
                <button
                  type="button"
                  key={member._id}
                  className={`member-item${
                    assignedUserIds.includes(member._id)
                      ? " member-item--selected"
                      : ""
                  }`}
                  onClick={() => {
                    setAssignedUserIds((prev) =>
                      prev.includes(member._id)
                        ? prev.filter((id) => id !== member._id)
                        : [...prev, member._id]
                    );
                  }}
                >
                  <span className="member-avatar">
                    {member.name?.charAt(0).toUpperCase() ||
                      member.email?.charAt(0).toUpperCase() ||
                      "?"}
                  </span>
                  <span className="member-name">
                    {member.name || member.email}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Task Info */}
        <div className="task-info">
          <div className="info-item">
            <span className="info-label">Created:</span>
            <span>{new Date(task.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="info-item">
            <span className="info-label">By:</span>
            <span>{task.createdBy?.name || "Unknown"}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="modal-actions">
          {isOwner ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-save"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <button onClick={onDelete} className="btn-delete">
                🗑️ Delete
              </button>
            </>
          ) : (
            <button onClick={onClose} className="btn-save">
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
