import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getBoardActivityAPI } from "../../api/taskApi";
import "./ActivityFeed.css";

export default function ActivityFeed({ boardId }) {
  const { userInfo } = useSelector((state) => state.auth);
  const { currentBoard } = useSelector((state) => state.board);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({
    action: "all",
    user: "all",
  });

  useEffect(() => {
    fetchActivity();
  }, [boardId, userInfo, page, filters]);

  const fetchActivity = async () => {
    if (!userInfo || !boardId) return;

    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      queryParams.append("page", page);
      queryParams.append("limit", 20);
      if (filters.action !== "all") queryParams.append("action", filters.action);
      if (filters.user !== "all") queryParams.append("user", filters.user);

      const response = await getBoardActivityAPI(
        boardId,
        userInfo.token,
        queryParams.toString()
      );

      const data = response.data || response;
      setActivities(Array.isArray(data) ? data : data.data || []);
      setPagination(response.pagination || data.pagination);
      setLoading(false);
    } catch (error) {
      console.error("Fetch activity error:", error);
      setError(error.response?.data?.message || "Failed to load activity");
      setLoading(false);
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const getActionIcon = (action) => {
    if (action.includes("created")) return "✨";
    if (action.includes("assigned")) return "👤";
    if (action.includes("unassigned")) return "❌";
    if (action.includes("updated")) return "✏️";
    if (action.includes("deleted")) return "🗑️";
    if (action.includes("moved")) return "🔄";
    if (action.includes("priority")) return "🎯";
    if (action.includes("status")) return "📊";
    if (action.includes("due date")) return "📅";
    if (action.includes("description")) return "📝";
    return "📌";
  };

  const getActivityMessage = (activity) => {
    const userName = activity.user?.name || "Someone";
    const action = activity.action;
    const meta = activity.meta || {};

    if (action === "created task") {
      return (
        <>
          <strong>{userName}</strong> created task in <em>{meta.listTitle}</em>
        </>
      );
    } else if (action === "assigned task") {
      return (
        <>
          <strong>{userName}</strong> assigned <em>{meta.assignedTo}</em> to task
        </>
      );
    } else if (action === "unassigned task") {
      return (
        <>
          <strong>{userName}</strong> unassigned <em>{meta.unassignedFrom}</em> from task
        </>
      );
    } else if (action === "moved task") {
      return (
        <>
          <strong>{userName}</strong> moved task from <em>{meta.fromList}</em> to <em>{meta.toList}</em>
        </>
      );
    } else if (action === "changed priority") {
      return (
        <>
          <strong>{userName}</strong> changed priority from <span className={`priority-badge ${meta.oldPriority}`}>{meta.oldPriority}</span> to <span className={`priority-badge ${meta.newPriority}`}>{meta.newPriority}</span>
        </>
      );
    } else if (action === "changed status") {
      return (
        <>
          <strong>{userName}</strong> changed status to <em>{meta.newStatus}</em>
        </>
      );
    } else if (action === "set due date") {
      return (
        <>
          <strong>{userName}</strong> set due date to <em>{meta.dueDate}</em>
        </>
      );
    } else if (action === "deleted task") {
      return (
        <>
          <strong>{userName}</strong> deleted task
        </>
      );
    } else {
      return (
        <>
          <strong>{userName}</strong> {action}
        </>
      );
    }
  };

  return (
    <div className="activity-feed">
      <div className="activity-header">
        <h4>📊 Activity Log</h4>
        {pagination && (
          <span className="activity-count">{pagination.totalItems} events</span>
        )}
      </div>

      {/* Filters */}
      <div className="activity-filters">
        <select
          value={filters.action}
          onChange={(e) => {
            setFilters({ ...filters, action: e.target.value });
            setPage(1);
          }}
          className="activity-filter-select"
        >
          <option value="all">All Actions</option>
          <option value="created">Created</option>
          <option value="assigned">Assigned</option>
          <option value="unassigned">Unassigned</option>
          <option value="moved">Moved</option>
          <option value="priority">Priority Changed</option>
          <option value="status">Status Changed</option>
          <option value="deleted">Deleted</option>
        </select>

        <select
          value={filters.user}
          onChange={(e) => {
            setFilters({ ...filters, user: e.target.value });
            setPage(1);
          }}
          className="activity-filter-select"
        >
          <option value="all">All Members</option>
          {currentBoard?.members?.map((member) => (
            <option key={member._id} value={member._id}>
              {member.name || member.email}
            </option>
          ))}
        </select>
      </div>

      <div className="activity-content">
        {loading && page === 1 ? (
          <div className="activity-loading">Loading activity...</div>
        ) : error ? (
          <div className="activity-error">{error}</div>
        ) : activities.length === 0 ? (
          <div className="activity-empty">No activity yet. Start creating tasks!</div>
        ) : (
          <>
            {activities.map((activity, i) => (
              <div key={activity._id || i} className="activity-item">
                <span className="activity-icon">{getActionIcon(activity.action)}</span>
                <div className="activity-details">
                  <div className="activity-text">{getActivityMessage(activity)}</div>
                  {activity.meta?.title && (
                    <div className="activity-task-title">"{activity.meta.title}"</div>
                  )}
                  <div className="activity-time">{getTimeAgo(activity.createdAt)}</div>
                </div>
              </div>
            ))}

            {pagination && pagination.totalPages > 1 && (
              <div className="activity-pagination">
                <button
                  disabled={!pagination.hasPrevPage || loading}
                  onClick={() => setPage(page - 1)}
                  className="pagination-btn"
                >
                  ← Previous
                </button>
                <span className="pagination-info">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  disabled={!pagination.hasNextPage || loading}
                  onClick={() => setPage(page + 1)}
                  className="pagination-btn"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}