// Utility helpers for drag & drop task reordering

// Group tasks by list id
export const groupTasksByList = (tasks) => {
  const map = {};
  tasks.forEach((task) => {
    const key = task.list;
    if (!map[key]) map[key] = [];
    map[key].push(task);
  });
  return map;
};

// Sort tasks in a list by order, falling back to createdAt
export const sortTasks = (tasks) => {
  return [...tasks].sort((a, b) => {
    const aHasOrder = typeof a.order === "number";
    const bHasOrder = typeof b.order === "number";

    if (aHasOrder && bHasOrder) {
      return a.order - b.order;
    }
    if (aHasOrder) return -1;
    if (bHasOrder) return 1;

    if (a.createdAt && b.createdAt) {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    return 0;
  });
};

// Reassign sequential order values within each list
export const reassignOrderPerList = (tasks) => {
  const byList = groupTasksByList(tasks);
  const updated = tasks.map((t) => ({ ...t }));

  Object.keys(byList).forEach((listId) => {
    const listTasks = sortTasks(byList[listId]);
    listTasks.forEach((task, index) => {
      const idx = updated.findIndex((t) => t._id === task._id);
      if (idx !== -1) {
        updated[idx].order = index;
      }
    });
  });

  return updated;
};

