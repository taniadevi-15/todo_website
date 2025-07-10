import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Helper functions
const isSameDay = (a, b) => a.toDateString() === b.toDateString();
const isSameWeek = (a, b) => {
  const getWeek = (d) => {
    const start = new Date(d.getFullYear(), 0, 1);
    const diff = (d - start) / (1000 * 60 * 60 * 24);
    return Math.ceil((diff + start.getDay() + 1) / 7);
  };
  return getWeek(a) === getWeek(b) && a.getFullYear() === b.getFullYear();
};
const isSameMonth = (a, b) => a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();

const resetRecurringTasks = (tasks) => {
  const today = new Date();
  return tasks.map((task) => {
    if (!task.completed || !task.completedDate) return task;

    const completed = new Date(task.completedDate);
    let shouldReset = false;

    switch (task.recurrence) {
      case "Daily":
        shouldReset = !isSameDay(today, completed);
        break;
      case "Weekly":
        shouldReset = !isSameWeek(today, completed);
        break;
      case "Monthly":
        shouldReset = !isSameMonth(today, completed);
        break;
    }

    return shouldReset
      ? { ...task, completed: false, completedDate: null }
      : task;
  });
};

function Home() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [tag, setTag] = useState("Personal");
  const [priority, setPriority] = useState("Low");
  const [recurrence, setRecurrence] = useState("None");
  const [reminder, setReminder] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const res = await axios.get("https://todo-websitee.onrender.com/todo/fetch", {
          withCredentials: true,
        });
        const updatedTodos = resetRecurringTasks(res.data.todos);
        setTodos(updatedTodos);
      } catch {
        setError("Failed to fetch tasks.");
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();

    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const scheduleReminder = (text, dateStr) => {
    const due = new Date(dateStr);
    const now = new Date();
    const delay = due - now;

    if (delay > 0) {
      setTimeout(() => {
        if (Notification.permission === "granted") {
          new Notification("⏰ Reminder", {
            body: `Your task "${text}" is due!`,
          });
        }
      }, delay);
    }
  };

  const createTodo = async () => {
    if (!newTodo.trim()) return;

    try {
      const res = await axios.post(
        "https://todo-websitee.onrender.com/todo/create",
        {
          text: newTodo,
          dueDate,
          tag,
          priority,
          recurrence,
          reminder,
          completed: false,
          completedDate: null,
        },
        { withCredentials: true }
      );

      setTodos([...todos, res.data.newTodo]);
      if (reminder && dueDate) scheduleReminder(newTodo, dueDate);

      // Reset form
      setNewTodo("");
      setDueDate("");
      setTag("Personal");
      setPriority("Low");
      setRecurrence("None");
      setReminder(false);
    } catch {
      setError("Failed to create task.");
    }
  };

  const toggleTodo = async (id) => {
    const todo = todos.find((t) => t._id === id);
    try {
      const res = await axios.put(
        `https://todo-websitee.onrender.com/todo/update/${id}`,
        {
          ...todo,
          completed: !todo.completed,
          completedDate: !todo.completed ? new Date().toISOString() : null,
        },
        { withCredentials: true }
      );
      setTodos(todos.map((t) => (t._id === id ? res.data.todo : t)));
    } catch {
      setError("Failed to update task.");
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`https://todo-websitee.onrender.com/todo/delete/${id}`, {
        withCredentials: true,
      });
      setTodos(todos.filter((t) => t._id !== id));
    } catch {
      setError("Failed to delete task.");
    }
  };

  const logout = async () => {
    try {
      await axios.get("https://todo-websitee.onrender.com/user/logout", {
        withCredentials: true,
      });
      toast.success("Logged out successfully");
      localStorage.removeItem("jwt");
      navigate("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  const remaining = todos.filter((t) => !t.completed).length;
  const priorityOrder = { high: 1, medium: 2, low: 3 };
  const sortedTodos = [...todos].sort((a, b) => {
    const aP = a.priority?.toLowerCase() || "low";
    const bP = b.priority?.toLowerCase() || "low";
    return priorityOrder[aP] - priorityOrder[bP];
  });

  return (
    <div className="my-10 max-w-2xl mx-auto p-8 bg-white dark:bg-zinc-900 rounded-xl shadow-xl transition-all">
      <h1 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white mb-6">
        🎯 Todo App
      </h1>

      {/* Task Input */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Add a new task"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="p-2 border rounded-md dark:bg-zinc-800 dark:text-white"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="p-2 border rounded-md dark:bg-zinc-800 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="p-2 border rounded-md dark:bg-zinc-800 dark:text-white"
          >
            <option value="Personal">🟢 Personal</option>
            <option value="Work">💼 Work</option>
            <option value="Urgent">⚠️ Urgent</option>
            <option value="Study">📘 Study</option>
          </select>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="p-2 border rounded-md dark:bg-zinc-800 dark:text-white"
          >
            <option value="Low">🟢 Low</option>
            <option value="Medium">🟡 Medium</option>
            <option value="High">🔴 High</option>
          </select>
          <select
            value={recurrence}
            onChange={(e) => setRecurrence(e.target.value)}
            className="p-2 border rounded-md dark:bg-zinc-800 dark:text-white"
          >
            <option value="None">🚫 No Repeat</option>
            <option value="Daily">🔁 Daily</option>
            <option value="Weekly">🔂 Weekly</option>
            <option value="Monthly">📅 Monthly</option>
          </select>
          <label className="flex items-center gap-2 text-sm dark:text-white">
            <input
              type="checkbox"
              checked={reminder}
              onChange={(e) => setReminder(e.target.checked)}
            />
            🔔 Reminder
          </label>
        </div>
      </div>

      <button
        onClick={createTodo}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded mb-6 transition"
      >
        ➕ Add Task
      </button>

      {/* Task List */}
      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600 dark:text-red-400">{error}</p>
      ) : (
        <ul className="space-y-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin">
          {sortedTodos.map((todo) => {
            const priority = todo.priority?.toLowerCase();
            const priorityClass =
              priority === "high"
                ? "bg-red-100 text-red-800 dark:bg-red-200"
                : priority === "medium"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-200"
                : "bg-green-100 text-green-800 dark:bg-green-200";

            const tagColors = {
              Urgent: "bg-red-200 text-red-800",
              Work: "bg-yellow-200 text-yellow-800",
              Study: "bg-blue-200 text-blue-800",
              Personal: "bg-green-200 text-green-800",
            };

            return (
              <li
                key={todo._id}
                className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-md flex justify-between items-start border dark:border-zinc-700 shadow-sm"
              >
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo._id)}
                    />
                    <span
                      className={`text-lg ${
                        todo.completed
                          ? "line-through text-gray-400"
                          : "text-gray-800 dark:text-white"
                      }`}
                    >
                      {todo.text}
                    </span>
                    {todo.reminder && <span title="Reminder Active">🔔</span>}
                  </div>
                  <div className="flex flex-wrap gap-2 ml-6 text-sm">
                    {todo.dueDate && (
                      <span className="text-gray-600 dark:text-gray-300">
                        📅 {new Date(todo.dueDate).toDateString()}
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        tagColors[todo.tag] || "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {todo.tag}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityClass}`}>
                      {todo.priority}
                    </span>
                    {todo.recurrence !== "None" && (
                      <span className="bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full text-xs font-medium">
                        🔁 {todo.recurrence}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deleteTodo(todo._id)}
                  className="text-red-500 font-medium hover:underline"
                >
                  Delete
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {/* Footer */}
      <p className="mt-4 text-center dark:text-gray-300">
        {remaining === 1 ? "1 task remaining" : `${remaining} tasks remaining`}
      </p>

      <button
        onClick={logout}
        className="mt-6 block mx-auto px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded transition"
      >
        🔓 Logout
      </button>
    </div>
  );
}

export default Home;
