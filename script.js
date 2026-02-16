const todoForm = document.querySelector("#todoForm");
const todoInput = document.querySelector("#todoInput");
const todoList = document.querySelector("#todoList");
const todoCount = document.querySelector("#todoCount");
const clearDoneButton = document.querySelector("#clearDone");
const template = document.querySelector("#todoItemTemplate");
const filterButtons = Array.from(document.querySelectorAll(".chip[data-filter]"));

let todos = [];
let activeFilter = "all";
const SETTINGS_KEY = "todo-atlas-settings";

const saveTodos = () => {
  localStorage.setItem("todo-atlas-items", JSON.stringify(todos));
};

const loadTodos = () => {
  const stored = localStorage.getItem("todo-atlas-items");
  todos = stored ? JSON.parse(stored) : [];
};

const getSettings = () => {
  const stored = localStorage.getItem(SETTINGS_KEY);
  const parsed = stored ? JSON.parse(stored) : {};
  return {
    taskLimit: 3,
    ...parsed,
  };
};

const updateCount = () => {
  const total = todos.length;
  const label = total === 1 ? "task" : "tasks";
  todoCount.textContent = `${total} ${label}`;
};

const applyFilter = (filter) => {
  activeFilter = filter;
  filterButtons.forEach((button) => {
    button.classList.toggle("chip--active", button.dataset.filter === filter);
  });
  renderTodos();
};

const createTodoElement = (todo) => {
  const item = template.content.firstElementChild.cloneNode(true);
  const checkbox = item.querySelector(".todo-item__checkbox");
  const text = item.querySelector(".todo-item__text");
  const deleteButton = item.querySelector(".todo-item__delete");

  item.dataset.id = todo.id;
  item.dataset.status = todo.done ? "done" : "active";
  checkbox.checked = todo.done;
  text.textContent = todo.text;

  checkbox.addEventListener("change", () => {
    todo.done = checkbox.checked;
    item.dataset.status = todo.done ? "done" : "active";
    saveTodos();
    updateCount();
  });

  deleteButton.addEventListener("click", () => {
    todos = todos.filter((entry) => entry.id !== todo.id);
    saveTodos();
    renderTodos();
  });

  return item;
};

const renderTodos = () => {
  todoList.innerHTML = "";
  const filtered = todos.filter((todo) => {
    if (activeFilter === "active") return !todo.done;
    if (activeFilter === "done") return todo.done;
    return true;
  });

  filtered.forEach((todo) => {
    todoList.append(createTodoElement(todo));
  });

  updateCount();
};

const addTodo = (text) => {
  const trimmed = text.trim();
  if (!trimmed) return;

  const { taskLimit } = getSettings();
  const activeCount = todos.filter((todo) => !todo.done).length;
  if (Number.isFinite(taskLimit) && taskLimit > 0 && activeCount >= taskLimit) {
    alert(`Task limit reached (${taskLimit} active). Complete one before adding more.`);
    return;
  }

  todos.unshift({
    id: crypto.randomUUID(),
    text: trimmed,
    done: false,
    createdAt: Date.now(),
  });

  saveTodos();
  renderTodos();
};

clearDoneButton.addEventListener("click", () => {
  todos = todos.filter((todo) => !todo.done);
  saveTodos();
  renderTodos();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => applyFilter(button.dataset.filter));
});

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addTodo(todoInput.value);
  todoInput.value = "";
  todoInput.focus();
});

loadTodos();
renderTodos();
