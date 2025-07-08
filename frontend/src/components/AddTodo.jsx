import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddTodo = ({ onAdd }) => {
  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [tag, setTag] = useState("Personal");
  const [priority, setPriority] = useState("Low");
  const [recurrence, setRecurrence] = useState("None");
  const [reminder, setReminder] = useState(false);
  const [listening, setListening] = useState(false);

  // 📤 Submit Handler
  const handleAdd = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newTask = {
      id: Date.now(),
      text,
      dueDate: dueDate ? dueDate.toISOString() : "",
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

    // Reset form
    setText("");
    setDueDate(null);
    setTag("Personal");
    setPriority("Low");
    setRecurrence("None");
    setReminder(false);
  };

  // 🔔 Notification Scheduling
  const scheduleReminder = (taskText, due) => {
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

  // 🔐 Ask for notification permission once
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

    recognition.onstart = () => setListening(true);
    recognition.onresult = (event) => {
      setText((prev) => prev + " " + event.results[0][0].transcript);
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
      className="flex flex-col md:flex-row flex-wrap gap-3 items-center justify-center w-full max-w-3xl mx-auto px-4 mb-4"
    >
      {/* 📝 Task Input */}
      <input
        type="text"
        placeholder="Add a new task"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full md:w-auto flex-1 p-2 border rounded"
      />

      {/* 🎤 Voice */}
      <button
        type="button"
        onClick={handleVoiceInput}
        className={`px-3 py-2 rounded text-white ${
          listening ? "bg-red-500" : "bg-indigo-500"
        } hover:opacity-90`}
      >
        🎤
      </button>

      {/* 📅 Date Picker */}
      <DatePicker
        selected={dueDate}
        onChange={(date) => setDueDate(date)}
        placeholderText="Due Date"
        dateFormat="dd-MM-yyyy"
        className="w-full md:w-auto p-2 border rounded"
      />

      {/* 🏷️ Tag */}
      <select
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        className="w-full md:w-auto p-2 border rounded"
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
        className="w-full md:w-auto p-2 border rounded"
      >
        <option value="Low">🟢 Low</option>
        <option value="Medium">🟡 Medium</option>
        <option value="High">🔴 High</option>
      </select>

      {/* 🔁 Recurrence */}
      <select
        value={recurrence}
        onChange={(e) => setRecurrence(e.target.value)}
        className="w-full md:w-auto p-2 border rounded"
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

      {/* ➕ Submit */}
      <button
        type="submit"
        className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
      >
        Add Task
      </button>
    </form>
  );
};

export default AddTodo;
