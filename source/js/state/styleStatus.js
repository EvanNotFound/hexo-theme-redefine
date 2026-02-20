const localStorageKey = "REDEFINE-THEME-STATUS";

const defaultStyleStatus = {
  isExpandPageWidth: false,
  isDark: theme.colors.default_mode && theme.colors.default_mode === "dark",
  fontSizeLevel: 0,
  isOpenPageAside: true,
};

export const styleStatus = {
  ...defaultStyleStatus,
};

const readStoredStatus = () => {
  try {
    const raw = localStorage.getItem(localStorageKey);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch (error) {
    console.error("Failed to read style status:", error);
    return null;
  }
};

export const getStyleStatus = () => {
  const stored = readStoredStatus();
  if (!stored) {
    return null;
  }

  Object.keys(styleStatus).forEach((key) => {
    if (stored[key] !== undefined) {
      styleStatus[key] = stored[key];
    }
  });

  return stored;
};

export const setStyleStatus = () => {
  try {
    localStorage.setItem(localStorageKey, JSON.stringify(styleStatus));
  } catch (error) {
    console.error("Failed to save style status:", error);
  }
};

export const updateStyleStatus = (updates = {}) => {
  Object.assign(styleStatus, updates);
  setStyleStatus();
};

export const resetStyleStatus = () => {
  Object.assign(styleStatus, defaultStyleStatus);
  setStyleStatus();
};
