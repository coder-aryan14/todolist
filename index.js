const express = require("express");
const path = require("path");

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

let todos = [];

app.get("/", (req, res) => {
  const filter = req.query.filter;
  const filteredTodos = filter ? todos.filter(t => t.priority === filter) : todos;
  res.render("list", { todos: filteredTodos });
});

app.post("/add", (req, res) => {
  const task = req.body.task.trim();
  const priority = req.body.priority || "normal";
  if (task) {
    todos.push({ task, priority });
  }
  res.redirect("/");
});

app.post("/delete/:index", (req, res) => {
  const index = req.params.index;
  todos.splice(index, 1);
  res.redirect("/");
});

app.post("/edit/:index", (req, res) => {
  const index = req.params.index;
  const editedTask = req.body.editedTask.trim();
  if (editedTask) {
    todos[index].task = editedTask;
  }
  res.redirect("/");
});

app.listen(8000, () => console.log("Server started on http://localhost:8000"));
