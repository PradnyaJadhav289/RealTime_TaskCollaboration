export default function BoardMembers({ members = [] }) {
  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const colors = ["#0079bf", "#d29034", "#519839", "#b04632", "#89609e"];

  return (
    <div style={{ display: "flex", gap: "6px" }}>
      {members.slice(0, 5).map((member, i) => (
        <div
          key={member._id || i}
          title={member.name || member.email}
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: colors[i % colors.length],
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "12px",
            fontWeight: "600",
            cursor: "pointer",
            border: "2px solid white",
          }}
        >
          {getInitials(member.name || member.email)}
        </div>
      ))}
      {members.length > 5 && (
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "#5e6c84",
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "11px",
            fontWeight: "600",
            border: "2px solid white",
          }}
        >
          +{members.length - 5}
        </div>
      )}
    </div>
  );
}
