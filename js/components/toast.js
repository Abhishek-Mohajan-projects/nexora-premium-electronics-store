function showToast(message, type = "success") {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "polite");

  const icon = type === "success" ? "✓" : type === "error" ? "✕" : "ℹ";
  const safeMessage = escapeHtml(String(message));
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${safeMessage}</span>
  `;

  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("toast-show"));

  setTimeout(() => {
    toast.classList.remove("toast-show");
    setTimeout(() => toast.remove(), 300);
  }, CONFIG.TOAST_DURATION_MS);
}
