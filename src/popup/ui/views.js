export function mostrarView(id) {
  const views = document.querySelectorAll(".view");
  const overlay = document.getElementById("privacidade-overlay");

  views.forEach((el) => {
    el.style.display = "none";
  });

  const ativa = document.getElementById(id);
  if (ativa) ativa.style.display = "flex";

  if (id === "view-lista") {
    overlay.style.display = "flex";
  } else {
    overlay.style.display = "none";
  }
}
