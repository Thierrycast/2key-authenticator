import { gerarTOTP } from "../lib/totp.js";

export async function renderCodigos(lista) {
  const container = document.getElementById("lista-codigos");
  container.innerHTML = "";

  for (const item of lista) {
    const div = document.createElement("div");
    div.className = "codigo";

    div.innerHTML = `
      <p class="nome">${item.nome}</p>
      <div class="linha-valor">
        <p class="valor" data-segredo="${item.segredo}">------</p>
        <button class="copiar-btn">
          <span class="tooltip">Copiar</span>
          <svg class="icone-copiar" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path fill="currentColor" d="M281.59,121.57V0H172.82c-31.81,0-57.59,25.78-57.59,57.59v332.73c0,31.8,25.78,57.59,57.59,57.59h230.35
            c31.8,0,57.59-25.78,57.59-57.59V179.16H339.18C307.38,179.16,281.59,153.38,281.59,121.57z M319.99,121.57V12.8l127.97,127.97
            H339.18C328.58,140.77,319.99,132.18,319.99,121.57z M89.71,67.24c-22.4,7.89-38.46,29.24-38.46,54.34v268.85
            c0,67.14,54.43,121.57,121.57,121.57h166.22c25.07,0,46.4-16.02,54.31-38.39l-220.53-0.01c-45.94,0-83.18-37.24-83.18-83.18
            L89.71,67.24z"/>
          </svg>
        </button>
      </div>
      <div class="tempo-barra">
        <div class="tempo-preenchido" style="width: 0%"></div>
      </div>
    `;

    container.appendChild(div);
  }

  container.querySelectorAll(".copiar-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const valorEl = btn.parentElement.querySelector(".valor");
      const texto = valorEl.textContent.replace(/\s/g, "");
      navigator.clipboard.writeText(texto);

      const tooltip = btn.querySelector(".tooltip");
      tooltip.textContent = "Copiado!";
      setTimeout(() => (tooltip.textContent = "Copiar"), 1500);
    });
  });
}