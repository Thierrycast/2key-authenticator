export function mostrarView(id) {
  document.querySelectorAll(".view").forEach((el) => {
    el.style.display = "none";
  });
  document.getElementById(id).style.display = "flex";
}