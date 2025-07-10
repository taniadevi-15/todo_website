// TodoList.jsx
import React, { useEffect, useState } from "react";
import { isSameDay, isSameWeek, isSameMonth } from "./utils/dateUtils";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("tasks")) || [];
    const today = new Date();

    const updated = stored.map((task) => {
      if (!task.completed || !task.completedDate) return task;

      const completedDate = new Date(task.completedDate);
      let reset = false;

      if (task.recurrence === "Daily" && !isSameDay(today, completedDate)) reset = true;
      else if (task.recurrence === "Weekly" && !isSameWeek(today, completedDate)) reset = true;
      else if (task.recurrence === "Monthly" && !isSameMonth(today, completedDate)) reset = true;

      return reset ? { ...task, completed: false, completedDate: null } : task;
    });

    setTasks(updated);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const toggleComplete = (id) => {
    setTasks(tasks.map((task) =>
      task.id === id
        ? {
            ...task,
            completed: !task.completed,
            completedDate: !task.completed ? new Date().toISOString() : null,
          }
        : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-3">
      {tasks.length === 0 ? (
        <p className="text-center text-gray-500">No tasks found.</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            className="flex justify-between items-center bg-white dark:bg-zinc-800 p-4 rounded shadow"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task.id)}
              />
              <span
                className={`text-lg ${
                  task.completed ? "line-through text-gray-400" : "text-black dark:text-white"
                }`}
              >
                {task.text}
              </span>
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
                {task.recurrence}
              </span>
            </div>
            <button onClick={() => deleteTask(task.id)} className="text-red-500 hover:text-red-700">
              🗑️
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default TodoList;
