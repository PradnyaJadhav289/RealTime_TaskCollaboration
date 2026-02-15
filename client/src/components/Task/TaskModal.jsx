import { useState } from "react";
import axios from "../../api/axios";
import { useSelector } from "react-redux";

export default function TaskModal({ task, onClose, onUpdate }) {
  const { userInfo } = useSelector((state) => state.auth);

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState(task.priority || "medium");
  const [dueDate, setDueDate] = useState(
    task.dueDate ? task.dueDate.split("T")[0] : ""
  );

  // =========================
  // SAVE TASK
  // =========================
  const handleSave = async () => {
    try {
      const res = await axios.put(
        `/tasks/${task._id}`,
        {
          title,
          description,
          priority,
          dueDate,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      onUpdate(res.data);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">

        <h3>Edit Task</h3>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />

        <label>Priority</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <label>Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <div style={{ marginTop: "15px" }}>
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Close</button>
        </div>

      </div>
    </div>
  );
}
