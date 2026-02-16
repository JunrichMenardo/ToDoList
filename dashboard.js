const completedCount = document.querySelector("#completedCount");
const remainingCount = document.querySelector("#remainingCount");
const totalCount = document.querySelector("#totalCount");
const progressPercent = document.querySelector("#progressPercent");
const progressBar = document.querySelector("#progressBar");
const dashboardReminderList = document.querySelector("#dashboardReminderList");
const dashboardGoalList = document.querySelector("#dashboardGoalList");

const REMINDER_KEY = "todo-atlas-reminders";
const GOAL_KEY = "todo-atlas-weekly-goals";

const getTodos = () => {
  const stored = localStorage.getItem("todo-atlas-items");
  return stored ? JSON.parse(stored) : [];
};

const getStoredList = (key) => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};

const updateStats = () => {
  const todos = getTodos();
  const total = todos.length;
  const done = todos.filter((todo) => todo.done).length;
  const remaining = total - done;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  completedCount.textContent = done;
  remainingCount.textContent = remaining;
  totalCount.textContent = total;
  progressPercent.textContent = `${percent}%`;
  progressBar.style.width = `${percent}%`;
};

const renderReminders = () => {
  if (!dashboardReminderList) return;
  const reminders = getStoredList(REMINDER_KEY)
    .slice()
    .sort((a, b) => a.dateTime.localeCompare(b.dateTime));

  dashboardReminderList.innerHTML = "";

  if (reminders.length === 0) {
    const empty = document.createElement("li");
    empty.className = "mini-item";
    empty.innerHTML = '<span class="mini-item__text">No reminders yet.</span>';
    dashboardReminderList.append(empty);
    return;
  }

  reminders.forEach((reminder) => {
    const item = document.createElement("li");
    item.className = "mini-item";
    item.innerHTML = `
      <span class="mini-item__text">${reminder.text}</span>
      <span class="mini-item__meta">${reminder.pretty}</span>
    `;
    dashboardReminderList.append(item);
  });
};

const renderGoals = () => {
  if (!dashboardGoalList) return;
  const goals = getStoredList(GOAL_KEY);

  dashboardGoalList.innerHTML = "";

  if (goals.length === 0) {
    const empty = document.createElement("li");
    empty.className = "mini-item";
    empty.innerHTML = '<span class="mini-item__text">No weekly goals yet.</span>';
    dashboardGoalList.append(empty);
    return;
  }

  goals.forEach((goal) => {
    const item = document.createElement("li");
    item.className = `mini-item${goal.done ? " mini-item--done" : ""}`;
    item.innerHTML = `
      <input class="mini-item__check" type="checkbox" ${goal.done ? "checked" : ""} disabled />
      <span class="mini-item__text">${goal.text}</span>
    `;
    dashboardGoalList.append(item);
  });
};

const updateDashboard = () => {
  updateStats();
  renderReminders();
  renderGoals();
};

updateDashboard();
window.addEventListener("storage", updateDashboard);
