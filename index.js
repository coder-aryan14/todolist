const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// Set EJS as the view engine
app.set("view engine", "ejs");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// ✅ Connect to MongoDB using Mongoose
mongoose.connect("mongodb://127.0.0.1:27017/todoDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ Connected to MongoDB");
}).catch(err => {
  console.error("❌ MongoDB connection error:", err);
});

// ✅ Mongoose Schema & Model
const itemSchema = new mongoose.Schema({
  task: String,
  priority: String
});

const Item = mongoose.model("Item", itemSchema);

// 🟢 GET "/" — Show To-Do List (with optional filtering)
app.get("/", async (req, res) => {
  const filter = req.query.filter;
  const query = filter ? { priority: filter } : {};

  try {
    const items = await Item.find(query);
    res.render("list", { todos: items });
  } catch (err) {
    res.status(500).send("Error fetching tasks");
  }
});

// 🟢 POST "/add" — Add a new task
app.post("/add", async (req, res) => {
  const task = req.body.task?.trim();
  const priority = req.body.priority || "normal";

  if (!task) {
    return res.send("<script>alert('Task cannot be empty'); window.location.href='/'</script>");
  }

  try {
    await Item.create({ task, priority });
    res.redirect("/");
  } catch (err) {
    res.status(500).send("Error adding task");
  }
});

// 🟢 POST "/edit/:id" — Edit an existing task
app.post("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const editedTask = req.body.editedTask?.trim();

  if (!editedTask) {
    return res.redirect("/");
  }

  try {
    await Item.findByIdAndUpdate(id, { task: editedTask });
    res.redirect("/");
  } catch (err) {
    res.status(500).send("Error editing task");
  }
});

// 🟢 POST "/delete/:id" — Delete a task
app.post("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await Item.findByIdAndDelete(id);
    res.redirect("/");
  } catch (err) {
    res.status(500).send("Error deleting task");
  }
});

// ✅ Start the Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
