export default function TaskCard({ title }) {
  return (
    <div
      style={{
        background: "white",
        padding: "10px",
        marginBottom: "8px",
        borderRadius: "6px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
      }}
    >
      {title}
    </div>
  );
}
