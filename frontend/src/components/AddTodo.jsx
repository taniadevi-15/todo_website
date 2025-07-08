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

  // ✅ Voice Input
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

  // ✅ Task Add Handler
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

  // ✅ Reminder Notification
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

  // ✅ Ask for notification permission
  useEffect(() => {
    if (Notification && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <form
      onSubmit={handleAdd}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl px-4 mx-auto mb-6"
    >
      <input
        type="text"
        placeholder="Add a new task"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="p-2 border rounded w-full"
      />

      <DatePicker
        selected={dueDate}
        onChange={(date) => setDueDate(date)}
        placeholderText="Due Date"
        dateFormat="dd-MM-yyyy"
        className="p-2 border rounded w-full"
      />

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleVoiceInput}
          className={`flex-1 px-3 py-2 rounded text-white text-sm font-semibold ${
            listening ? "bg-red-500" : "bg-indigo-500"
          } hover:opacity-90`}
        >
          🎤 Voice
        </button>

        <label className="flex items-center text-sm gap-2">
          <input
            type="checkbox"
            checked={reminder}
            onChange={(e) => setReminder(e.target.checked)}
          />
          <span>🔔 Reminder</span>
        </label>
      </div>

      <select
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        className="p-2 border rounded w-full"
      >
        <option value="Personal">Personal</option>
        <option value="Work">Work</option>
        <option value="Urgent">Urgent</option>
        <option value="Study">Study</option>
      </select>

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="p-2 border rounded w-full"
      >
        <option value="Low">🟢 Low</option>
        <option value="Medium">🟡 Medium</option>
        <option value="High">🔴 High</option>
      </select>

      <select
        value={recurrence}
        onChange={(e) => setRecurrence(e.target.value)}
        className="p-2 border rounded w-full"
      >
        <option value="None">No Repeat</option>
        <option value="Daily">Daily</option>
        <option value="Weekly">Weekly</option>
        <option value="Monthly">Monthly</option>
      </select>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-800 col-span-1 sm:col-span-2 md:col-span-3"
      >
        ➕ Add Task
      </button>
    </form>
  );
};

export default AddTodo;
