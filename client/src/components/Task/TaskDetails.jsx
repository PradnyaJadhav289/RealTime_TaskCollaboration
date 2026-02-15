import { useState } from "react";
import axios from "../../api/axios";
import { useSelector } from "react-redux";

export default function TaskDetails({ task, onClose, onUpdate }) {
  const { userInfo } = useSelector((state) => state.auth);

  const [title, setTitle] = useState(task.title);
  const [priority, setPriority] = useState(
    task.priority || "medium"
  );
  const [dueDate, setDueDate] = useState(
    task.dueDate ? task.dueDate.split("T")[0] : ""
  );

  const saveTask = async () => {
    try {
      const res = await axios.put(
        `/tasks/${task._id}`,
        { title, priority, dueDate },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      onUpdate(res.data);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">

        <h3>Task Details</h3>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <div style={{ marginTop: "10px" }}>
          <button onClick={saveTask}>Save</button>
          <button onClick={onClose}>Close</button>
        </div>

      </div>
    </div>
  );
}
