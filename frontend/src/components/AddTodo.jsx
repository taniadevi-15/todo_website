import React, { useState, useEffect } from "react";

const AddTodo = ({ onAdd }) => {
  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [tag, setTag] = useState("Personal");
  const [priority, setPriority] = useState("Low");
  const [recurrence, setRecurrence] = useState("None");
  const [reminder, setReminder] = useState(false);
  const [listening, setListening] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newTask = {
      id: Date.now(),
      text,
      dueDate,
      tag,
      priority,
      recurrence,
      reminder,
      completed: false,
    };

    onAdd(newTask);

    if (reminder && dueDate) {
      scheduleReminder(text, dueDate);
    }

    // Reset
    setText("");
    setDueDate("");
    setTag("Personal");
    setPriority("Low");
    setRecurrence("None");
    setReminder(false);
  };

  // 🔔 Notification Function
  const scheduleReminder = (taskText, dueDate) => {
    const due = new Date(dueDate);
    const now = new Date();
    const timeUntilDue = due.getTime() - now.getTime();

    if (timeUntilDue > 0) {
      setTimeout(() => {
        if (Notification.permission === "granted") {
          new Notification("⏰ Task Reminder", {
            body: `Don't forget: "${taskText}" is due today!`,
          });
        }
      }, timeUntilDue);
    }
  };

  // 🔔 Request Notification Permission on Mount
  useEffect(() => {
    if (Notification && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // 🎤 Voice Input
  const handleVoiceInput = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText((prev) => prev + " " + transcript);
      setListening(false);
    };

    recognition.onerror = () => {
      alert("Voice input failed");
      setListening(false);
    };

    recognition.start();
  };

  return (
    <form
      onSubmit={handleAdd}
      className="flex flex-col md:flex-row gap-3 items-center justify-center mb-4 flex-wrap"
    >
      {/* 📝 Todo Input */}
      <input
        className="w-full p-2 border rounded"
        type="text"
        placeholder="Add a new todo"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {/* 🎤 Voice Button */}
      <button
        type="button"
        onClick={handleVoiceInput}
        className={`px-2 py-1 rounded text-white ${listening ? "bg-red-500" : "bg-indigo-500"} hover:opacity-90`}
      >
        🎤
      </button>

      {/* 📅 Due Date */}
      <input
        className="p-2 border rounded"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      {/* 🏷️ Tag */}
      <select
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="Personal">Personal</option>
        <option value="Work">Work</option>
        <option value="Urgent">Urgent</option>
        <option value="Study">Study</option>
      </select>

      {/* 🚦 Priority */}
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="Low">🟢 Low</option>
        <option value="Medium">🟡 Medium</option>
        <option value="High">🔴 High</option>
      </select>

      {/* 🔁 Recurrence */}
      <select
        value={recurrence}
        onChange={(e) => setRecurrence(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="None">No Repeat</option>
        <option value="Daily">Daily</option>
        <option value="Weekly">Weekly</option>
        <option value="Monthly">Monthly</option>
      </select>

      {/* 🔔 Reminder */}
      <label className="flex items-center gap-1 text-sm">
        <input
          type="checkbox"
          checked={reminder}
          onChange={(e) => setReminder(e.target.checked)}
        />
        Reminder
      </label>

      {/* ➕ Add Button */}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
      >
        Add
      </button>
    </form>
  );
};

export default AddTodo;
