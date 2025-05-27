import { configurarGerenciar } from "./logic/gerenciar.js";
import { configurarInterface} from "./logic/interface.js";

const EXPIRACAO_KEY = "tempoExpiracao";

function verificarAutenticacao() {
  const senha = localStorage.getItem("senhaMestre");
  if (!senha) {
    document.body.innerHTML = `
      <div class="container" style="padding-top: 80px; text-align: center;">
        <h1>🔒 Acesso restrito</h1>
        <p style="color: #a1a1aa; font-size: 15px; margin-top: 12px;">
          Por segurança, acesse o <strong>popup</strong> da extensão e autentique-se com sua senha mestre.
        </p>
      </div>
    `;
    return false;
  }
  return true;
}

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
      document.getElementById(`pagina-${alvo}`)?.classList.add("ativa");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (!verificarAutenticacao()) return;

  carregarConfiguracoes();
  configurarListeners();
  configurarNavegacao();
  configurarGerenciar();
  configurarInterface();
});
