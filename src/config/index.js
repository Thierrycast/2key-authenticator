const EXPIRACAO_KEY = "tempoExpiracao";

function carregarConfiguracoes() {
  const select = document.getElementById("tempo-expiracao");
  const tempo = localStorage.getItem(EXPIRACAO_KEY) ?? "0";
  select.value = tempo;
  atualizarAvisoSenha(tempo);
}

function atualizarAvisoSenha(valor) {
  const alerta = document.querySelector(".alerta");
  alerta.style.display = valor === "0" ? "none" : "block";
}

function configurarListeners() {
  const form = document.getElementById("form-config");
  const select = document.getElementById("tempo-expiracao");
  const msg = document.getElementById("mensagem-sucesso");

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

document.addEventListener("DOMContentLoaded", () => {
  carregarConfiguracoes();
  configurarListeners();
});
