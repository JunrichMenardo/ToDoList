const settingsForm = document.querySelector("#settingsForm");
const dailyReminderToggle = document.querySelector("#dailyReminder");
const reminderTimeInput = document.querySelector("#reminderTime");
const taskLimitSelect = document.querySelector("#taskLimit");
const themeSelect = document.querySelector("#themeSelect");
const settingsStatus = document.querySelector("#settingsStatus");

const SETTINGS_KEY = "todo-atlas-settings";

const getDefaultSettings = () => ({
  dailyReminder: true,
  reminderTime: "09:00",
  taskLimit: 3,
  theme: "atlas",
});

const loadSettings = () => {
  const stored = localStorage.getItem(SETTINGS_KEY);
  const parsed = stored ? JSON.parse(stored) : {};
  return { ...getDefaultSettings(), ...parsed };
};

const saveSettings = (settings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

const setStatus = (message) => {
  settingsStatus.textContent = message;
  settingsStatus.classList.add("settings-status--show");
  window.setTimeout(() => {
    settingsStatus.classList.remove("settings-status--show");
  }, 2200);
};

const syncForm = () => {
  const settings = loadSettings();
  dailyReminderToggle.checked = settings.dailyReminder;
  reminderTimeInput.value = settings.reminderTime;
  taskLimitSelect.value = String(settings.taskLimit);
  themeSelect.value = settings.theme;
};

settingsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const settings = {
    dailyReminder: dailyReminderToggle.checked,
    reminderTime: reminderTimeInput.value || "09:00",
    taskLimit: Number.parseInt(taskLimitSelect.value, 10),
    theme: themeSelect.value,
  };

  saveSettings(settings);
  if (window.todoAtlasSettings) {
    window.todoAtlasSettings = settings;
  }
  if (typeof window.applyTodoAtlasTheme === "function") {
    window.applyTodoAtlasTheme(settings.theme);
  } else if (document.body) {
    document.body.classList.remove("theme-atlas", "theme-sunrise", "theme-mint");
    document.body.classList.add(`theme-${settings.theme}`);
  }

  setStatus("Settings saved");
});

syncForm();
window.addEventListener("storage", syncForm);
