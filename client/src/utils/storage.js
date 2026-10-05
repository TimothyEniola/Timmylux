export function readStoredJson(key, fallback) {
  if (typeof window === "undefined") return fallback;

  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallback;
  } catch {
    return fallback;
  }
}

export function readStoredArray(key) {
  const value = readStoredJson(key, []);
  return Array.isArray(value) ? value : [];
}

export function readStoredString(key, fallback = "") {
  if (typeof window === "undefined") return fallback;
  try {
    return window.localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}
