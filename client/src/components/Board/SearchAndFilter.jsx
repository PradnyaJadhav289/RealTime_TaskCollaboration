import { useState } from "react";
import { useSelector } from "react-redux";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";
import "./SearchAndFilter.css";

export default function SearchAndFilter({ filters, setFilters, applyFilters, lists }) {
  const [showFilters, setShowFilters] = useState(false);
  const { currentBoard } = useSelector((state) => state.board);

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      applyFilters();
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    // Auto-apply for dropdown filters (not search)
    if (key !== "search") {
      setFilters(newFilters);
      // Use setTimeout to ensure state is updated
      setTimeout(() => {
        applyFilters();
      }, 0);
    }
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: "",
      priority: "all",
      status: "all",
      assignedTo: "all",
      listId: "all",
    };
    setFilters(clearedFilters);
    setTimeout(() => {
      applyFilters();
    }, 0);
  };

  const hasActiveFilters =
    filters.search ||
    filters.priority !== "all" ||
    filters.status !== "all" ||
    filters.assignedTo !== "all" ||
    filters.listId !== "all";

  return (
    <div className="search-filter-container">
      <div className="search-bar">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search tasks... (Press Enter)"
          value={filters.search}
          onChange={handleSearchChange}
          onKeyPress={handleSearchKeyPress}
          className="search-input"
        />
        {filters.search && (
          <button
            onClick={() => {
              setFilters({ ...filters, search: "" });
              setTimeout(() => applyFilters(), 0);
            }}
            className="clear-search-btn"
          >
            <FiX />
          </button>
        )}
        <button
          onClick={applyFilters}
          className="search-apply-btn"
          title="Apply search"
        >
          Search
        </button>
      </div>

      <button
        onClick={() => setShowFilters(!showFilters)}
        className={`filter-toggle-btn ${hasActiveFilters ? "active" : ""}`}
      >
        <FiFilter />
        Filters
        {hasActiveFilters && <span className="filter-badge">●</span>}
      </button>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange("priority", e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="todo">To Do</option>
              <option value="doing">Doing</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div className="filter-group">
            <label>List</label>
            <select
              value={filters.listId}
              onChange={(e) => handleFilterChange("listId", e.target.value)}
            >
              <option value="all">All Lists</option>
              {lists.map((list) => (
                <option key={list._id} value={list._id}>
                  {list.title}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Assigned To</label>
            <select
              value={filters.assignedTo}
              onChange={(e) => handleFilterChange("assignedTo", e.target.value)}
            >
              <option value="all">All Members</option>
              {currentBoard?.members?.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name || member.email}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button onClick={clearFilters} className="clear-filters-btn">
              <FiX /> Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}