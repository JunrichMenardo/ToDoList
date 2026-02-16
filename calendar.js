const reminderForm = document.querySelector("#reminderForm");
const reminderText = document.querySelector("#reminderText");
const reminderDate = document.querySelector("#reminderDate");
const reminderTime = document.querySelector("#reminderTime");
const reminderList = document.querySelector("#reminderList");

const goalForm = document.querySelector("#goalForm");
const goalInput = document.querySelector("#goalInput");
const goalList = document.querySelector("#goalList");

const REMINDER_KEY = "todo-atlas-reminders";
const GOAL_KEY = "todo-atlas-weekly-goals";

let reminders = [];
let goals = [];

const save = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const load = (key) => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};

const renderReminders = () => {
  reminderList.innerHTML = "";
  reminders
    .slice()
    .sort((a, b) => a.dateTime.localeCompare(b.dateTime))
    .forEach((reminder) => {
      const item = document.createElement("li");
      item.className = "mini-item";
      item.innerHTML = `
        <span class="mini-item__text">${reminder.text}</span>
        <span class="mini-item__meta">${reminder.pretty}</span>
        <button class="mini-item__delete" type="button">Delete</button>
      `;

      item.querySelector(".mini-item__delete").addEventListener("click", () => {
        reminders = reminders.filter((entry) => entry.id !== reminder.id);
        save(REMINDER_KEY, reminders);
        renderReminders();
      });

      reminderList.append(item);
    });
};

const renderGoals = () => {
  goalList.innerHTML = "";
  goals.forEach((goal) => {
    const item = document.createElement("li");
    item.className = `mini-item${goal.done ? " mini-item--done" : ""}`;
    item.innerHTML = `
      <input class="mini-item__check" type="checkbox" ${goal.done ? "checked" : ""} />
      <span class="mini-item__text">${goal.text}</span>
      <button class="mini-item__delete" type="button">Delete</button>
    `;

    const checkbox = item.querySelector(".mini-item__check");
    checkbox.addEventListener("change", () => {
      goal.done = checkbox.checked;
      save(GOAL_KEY, goals);
      renderGoals();
    });

    item.querySelector(".mini-item__delete").addEventListener("click", () => {
      goals = goals.filter((entry) => entry.id !== goal.id);
      save(GOAL_KEY, goals);
      renderGoals();
    });

    goalList.append(item);
  });
};

reminderForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = reminderText.value.trim();
  if (!text || !reminderDate.value || !reminderTime.value) return;

  const dateTime = `${reminderDate.value}T${reminderTime.value}`;
  const pretty = new Date(dateTime).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  reminders.push({
    id: crypto.randomUUID(),
    text,
    dateTime,
    pretty,
  });

  save(REMINDER_KEY, reminders);
  renderReminders();
  reminderForm.reset();
});

goalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = goalInput.value.trim();
  if (!text) return;

  goals.unshift({
    id: crypto.randomUUID(),
    text,
    done: false,
  });

  save(GOAL_KEY, goals);
  renderGoals();
  goalForm.reset();
});

reminders = load(REMINDER_KEY);
goals = load(GOAL_KEY);
renderReminders();
renderGoals();
