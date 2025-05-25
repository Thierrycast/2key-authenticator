import { mostrarView } from "./views.js";

export function configurarPrivacidadeOverlay() {
  const overlay = document.getElementById("privacidade-overlay");
  const toggle = document.getElementById("toggle-visibilidade");
  const toggleOlho = document.getElementById("toggle-privacidade");

  overlay.style.display = "flex";

  toggle?.addEventListener("click", () => {
    overlay.style.display = "none";
  });

  toggleOlho?.addEventListener("click", () => {
    overlay.style.display = "flex";
  });
}