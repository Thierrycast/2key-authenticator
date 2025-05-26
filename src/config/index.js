import { configurarGerenciar } from "./logic/gerenciar.js";

const EXPIRACAO_KEY = "tempoExpiracao";

function carregarConfiguracoes() {
  const select = document.getElementById("tempo-expiracao");
  if (!select) return;
  const tempo = localStorage.getItem(EXPIRACAO_KEY) ?? "0";
  select.value = tempo;
  atualizarAvisoSenha(tempo);
}

function atualizarAvisoSenha(valor) {
  const alerta = document.querySelector(".alerta");
  if (alerta) {
    alerta.style.display = valor === "0" ? "none" : "block";
  }
}

function configurarListeners() {
  const form = document.getElementById("form-config");
  const select = document.getElementById("tempo-expiracao");
  const msg = document.getElementById("mensagem-sucesso");

  if (!form || !select || !msg) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const tempo = select.value;
    localStorage.setItem(EXPIRACAO_KEY, tempo);
    atualizarAvisoSenha(tempo);

    msg.style.display = "block";
    setTimeout(() => (msg.style.display = "none"), 2000);
  });

  select.addEventListener("change", (e) => {
    atualizarAvisoSenha(e.target.value);
  });
}

function configurarNavegacao() {
  const botoes = document.querySelectorAll(".item-nav");
  const paginas = document.querySelectorAll(".pagina");

  botoes.forEach((btn) => {
    btn.addEventListener("click", () => {
      const alvo = btn.dataset.page;

      botoes.forEach((b) => b.classList.remove("ativo"));
      btn.classList.add("ativo");

      paginas.forEach((p) => p.classList.remove("ativa"));
      const paginaAlvo = document.getElementById(`pagina-${alvo}`);
      if (paginaAlvo) {
        paginaAlvo.classList.add("ativa");

        if (alvo === "gerenciar") {
          configurarGerenciar();
        }
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  carregarConfiguracoes();
  configurarListeners();
  configurarNavegacao();
  configurarGerenciar();
});
