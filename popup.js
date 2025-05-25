import { gerarTOTP } from "./totp.js";

const codigosMock = [
  { nome: "GitHub", segredo: "JBSWY3DPEHPE3PXP" },
  { nome: "Google", segredo: "JBSWY3DPEHPK3PXP" },
  { nome: "Discord", segredo: "JBSWY3DPEHPK3PXP" },
  { nome: "GitHub", segredo: "JBSWY3DPEHPK3PXP" },
  { nome: "Google", segredo: "JBSWY3DPEHPK3PXP" },
  { nome: "Discord", segredo: "JBSWY3DPEHPK3PXP" },
  { nome: "GitHub", segredo: "JBSWY3DPEHPK3PXP" },
  { nome: "Google", segredo: "JBSWY3DPEHPK3PXP" },
  { nome: "Discord", segredo: "JBSWY3DPEHPK3PXP" }
];

function renderCodigos(lista) {
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

async function atualizarTotps() {
  const elementos = document.querySelectorAll(".valor");
  const agora = Date.now();
  const tempoAtual = Math.floor(agora / 1000);
  const segundosRestantes = 30 - (tempoAtual % 30);
  const progresso = (segundosRestantes / 30) * 100;

  for (const el of elementos) {
    const segredo = el.dataset.segredo;
    const codigo = await gerarTOTP(segredo);
    el.textContent = `${codigo.slice(0, 3)} ${codigo.slice(3)}`;

    if (segundosRestantes <= 5) {
      el.style.color = "#f87171";
      el.classList.add("piscar");
    } else {
      el.style.color = "#60a5fa";
      el.classList.remove("piscar");
    }

    const barra = el.parentElement.parentElement.querySelector(".tempo-preenchido");
    if (barra) {
      barra.style.width = `${progresso}%`;
      barra.style.backgroundColor = segundosRestantes <= 5 ? "#f87171" : "#3b82f6";
    }
  }
}

function configurarViewToggle() {
  document.getElementById("abrir-formulario").addEventListener("click", () => {
    document.getElementById("view-lista").style.display = "none";
    document.getElementById("view-adicionar").style.display = "flex";
  });

  document.getElementById("cancelar-form").addEventListener("click", () => {
    document.getElementById("view-adicionar").style.display = "none";
    document.getElementById("view-lista").style.display = "flex";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderCodigos(codigosMock);
  atualizarTotps();
  setInterval(atualizarTotps, 1000);
  configurarViewToggle();
});
