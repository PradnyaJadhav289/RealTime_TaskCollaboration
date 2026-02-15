export default function ListHeader({ title }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "10px",
      }}
    >
      <h4 style={{ margin: 0 }}>{title}</h4>
      <span style={{ cursor: "pointer" }}>⋮</span>
    </div>
  );
}
