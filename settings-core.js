const SETTINGS_KEY = "todo-atlas-settings";
const THEME_CLASSES = ["theme-atlas", "theme-sunrise", "theme-mint"];

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

const applyTheme = (theme) => {
  THEME_CLASSES.forEach((className) => document.body.classList.remove(className));
  document.body.classList.add(`theme-${theme}`);
};

window.applyTodoAtlasTheme = applyTheme;

const refreshSettings = () => {
  const settings = loadSettings();
  window.todoAtlasSettings = settings;
  applyTheme(settings.theme);
};

refreshSettings();
window.addEventListener("storage", refreshSettings);
