export default function BoardMembers() {
  const members = ["P", "R", "A"];

  return (
    <div style={{ display: "flex", gap: "6px" }}>
      {members.map((m, i) => (
        <div
          key={i}
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            background: "#4f6ef7",
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {m}
        </div>
      ))}
    </div>
  );
}
