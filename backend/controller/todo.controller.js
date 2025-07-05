import Todo from "../model/todo.model.js";

// ✅ CREATE TODO
export const createTodo = async (req, res) => {
  try {
    const {
      text,
      dueDate = null,
      tag = "Personal",
      priority = "Low",
      recurrence = "None",
      reminder = false,
      completed = false,
    } = req.body;

    const todo = new Todo({
      text,
      completed,
      user: req.user._id,
      dueDate,
      tag,
      priority,
      recurrence,
      reminder,
    });

    const newTodo = await todo.save();
    res.status(201).json({ message: "Todo Created Successfully", newTodo });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error occurred while creating todo" });
  }
};

// ✅ GET ALL TODOS FOR LOGGED-IN USER
export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id });
    res.status(200).json({ message: "Todos Fetched Successfully", todos });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error occurred while fetching todos" });
  }
};

// ✅ UPDATE A TODO (Only if owned by user)
export const updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!todo) {
      return res.status(404).json({ message: "Todo not found or unauthorized" });
    }

    res.status(200).json({ message: "Todo Updated Successfully", todo });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error occurred while updating todo" });
  }
};

// ✅ DELETE A TODO (Only if owned by user)
export const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found or unauthorized" });
    }

    res.status(200).json({ message: "Todo Deleted Successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error occurred while deleting todo" });
  }
};
