import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getBoardActivityAPI } from "../../api/taskApi";
import "./ActivityFeed.css";

export default function ActivityFeed({ boardId }) {
  const { userInfo } = useSelector((state) => state.auth);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivity = async () => {
      if (!userInfo || !boardId) return;

      try {
        setLoading(true);
        setError(null);
        const response = await getBoardActivityAPI(boardId, userInfo.token);
        
        // Handle both response formats
        const data = response.data || response;
        setActivities(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (error) {
        console.error("Fetch activity error:", error);
        setError(error.response?.data?.message || "Failed to load activity");
        setLoading(false);
      }
    };

    fetchActivity();

    // Refresh every 10 seconds
    const interval = setInterval(fetchActivity, 10000);
    return () => clearInterval(interval);
  }, [boardId, userInfo]);

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const getActionIcon = (action) => {
    if (action.includes("created")) return "✨";
    if (action.includes("updated")) return "✏️";
    if (action.includes("deleted")) return "🗑️";
    if (action.includes("moved")) return "🔄";
    return "📝";
  };

  return (
    <div className="activity-feed">
      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid #ddd",
          background: "#f4f5f7",
          position: "sticky",
          top: 0,
        }}
      >
        <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>
          📊 Activity
        </h4>
      </div>

      <div
        style={{
          padding: "12px",
          overflowY: "auto",
          flex: 1,
        }}
      >
        {loading ? (
          <div style={{ color: "#5e6c84", fontSize: "14px", textAlign: "center" }}>
            Loading activity...
          </div>
        ) : error ? (
          <div
            style={{
              padding: "12px",
              background: "#ffebee",
              color: "#c62828",
              borderRadius: "6px",
              fontSize: "13px",
            }}
          >
            {error}
          </div>
        ) : activities.length === 0 ? (
          <div
            style={{
              color: "#5e6c84",
              fontSize: "14px",
              textAlign: "center",
              padding: "20px",
            }}
          >
            No activity yet. Start creating tasks!
          </div>
        ) : (
          activities.map((activity, i) => (
            <div
              key={activity._id || i}
              style={{
                marginBottom: "12px",
                padding: "12px",
                background: "white",
                borderRadius: "6px",
                border: "1px solid #dfe1e6",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  marginBottom: "4px",
                  color: "#172b4d",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>{getActionIcon(activity.action)}</span>
                <strong>{activity.user?.name || "Someone"}</strong>
                <span style={{ color: "#5e6c84" }}>{activity.action}</span>
              </div>
              {activity.meta?.title && (
                <div
                  style={{
                    fontSize: "12px",
                    color: "#5e6c84",
                    marginBottom: "4px",
                    marginLeft: "22px",
                  }}
                >
                  "{activity.meta.title}"
                </div>
              )}
              <div
                style={{
                  fontSize: "11px",
                  color: "#8993a4",
                  marginLeft: "22px",
                }}
              >
                {getTimeAgo(activity.createdAt)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
