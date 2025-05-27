const CHAVE_TEMA = "preferenciaTema";

export function configurarInterface() {
  const selectTema = document.getElementById("seletor-tema");
  if (!selectTema) return;

  const temaSalvo = localStorage.getItem(CHAVE_TEMA) ?? "dark";
  selectTema.value = temaSalvo;
  aplicarTema(temaSalvo);

  selectTema.addEventListener("change", (e) => {
    const tema = e.target.value;
    localStorage.setItem(CHAVE_TEMA, tema);
    aplicarTema(tema);
  });
}

function aplicarTema(tema) {
  const html = document.documentElement;
  if (tema === "auto") {
    const darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    html.setAttribute("data-theme", darkMode ? "dark" : "light");
  } else {
    html.setAttribute("data-theme", tema);
  }
}
