export function configurarPrivacidadeOverlay() {
  const overlay = document.getElementById("privacidade-overlay");
  const toggle = document.getElementById("toggle-visibilidade");
  const toggleOlho = document.getElementById("toggle-privacidade");

  toggle?.addEventListener("click", () => {
    overlay.style.display = "none";
  });

  toggleOlho?.addEventListener("click", () => {
    overlay.style.display = "flex";
  });
}