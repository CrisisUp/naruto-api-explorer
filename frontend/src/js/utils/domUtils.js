// frontend/src/js/utils/domUtils.js

export function escapeHtml(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function safeArray(value) {
  if (!value) return "Desconhecido";
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}

export function showElement(element) {
  element?.classList.remove("hidden");
}

export function hideElement(element) {
  element?.classList.add("hidden");
}
