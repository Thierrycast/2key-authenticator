import { gerarTOTP } from "./totp.js";

const codigosMock = [
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
      <p class="valor" data-segredo="${item.segredo}">------</p>
      <div class="linha"></div>
    `;

    container.appendChild(div);
  }
}

async function atualizarTotps() {
  const elementos = document.querySelectorAll(".valor");

  for (const el of elementos) {
    const segredo = el.dataset.segredo;
    const codigo = await gerarTOTP(segredo);
    el.textContent = codigo;
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
