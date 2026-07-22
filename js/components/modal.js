function openModal(content) {
  closeModal();
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");

  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <button class="modal-close" aria-label="Close modal">&times;</button>
    <div class="modal-content">${content}</div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";

  overlay.querySelector(".modal-close").addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener("keydown", function escHandler(e) {
    if (e.key === "Escape") {
      closeModal();
      document.removeEventListener("keydown", escHandler);
    }
  });
}

function closeModal() {
  const overlay = document.querySelector(".modal-overlay");
  if (overlay) {
    overlay.classList.add("modal-closing");
    setTimeout(() => {
      overlay.remove();
      document.body.style.overflow = "";
    }, 200);
  }
}
