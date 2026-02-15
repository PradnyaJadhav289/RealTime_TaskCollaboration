
import './ActivityFeed.css';
export default function ActivityFeed() {
  const logs = [
    "Pradnya moved task Todo → Done",
    "Rahul created task",
    "Aman updated priority",
  ];

  return (
    <div className="activity-feed">
      <h4>Activity</h4>

      {logs.map((log, i) => (
        <p key={i}>{log}</p>
      ))}
    </div>
  );
}
