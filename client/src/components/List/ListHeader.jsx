import { useState, useRef, useEffect } from "react";

export default function ListHeader({ title, onDelete, taskCount }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px",
        position: "relative",
      }}
    >
      <div>
        <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>
          {title}
        </h4>
        <span style={{ fontSize: "12px", color: "#5e6c84" }}>
          {taskCount} {taskCount === 1 ? "card" : "cards"}
        </span>
      </div>

      <div ref={menuRef} style={{ position: "relative" }}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "18px",
            padding: "4px 8px",
            borderRadius: "4px",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#dfe1e6")}
          onMouseLeave={(e) => (e.target.style.background = "transparent")}
        >
          ⋮
        </button>

        {showMenu && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              right: 0,
              background: "white",
              boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
              borderRadius: "8px",
              padding: "8px",
              minWidth: "180px",
              zIndex: 100,
            }}
          >
            <button
              onClick={() => {
                onDelete();
                setShowMenu(false);
              }}
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "transparent",
                border: "none",
                textAlign: "left",
                cursor: "pointer",
                borderRadius: "4px",
                color: "#c92a2a",
                fontSize: "14px",
              }}
              onMouseEnter={(e) => (e.target.style.background = "#ffebee")}
              onMouseLeave={(e) => (e.target.style.background = "transparent")}
            >
              🗑️ Delete List
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
