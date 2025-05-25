const EXPIRACAO_KEY = "tempoExpiracao";

function carregarConfiguracoes() {
  const tempo = localStorage.getItem(EXPIRACAO_KEY) ?? "0";
  document.getElementById("tempo-expiracao").value = tempo;
  atualizarAvisoSenha(tempo);
}

function atualizarAvisoSenha(valor) {
  const alerta = document.querySelector(".alerta");
  if (valor === "0") {
    alerta.style.display = "none";
  } else {
    alerta.style.display = "block";
  }
}

function configurarListeners() {
  document.getElementById("form-config").addEventListener("submit", (e) => {
    e.preventDefault();

    const tempo = document.getElementById("tempo-expiracao").value;
    localStorage.setItem(EXPIRACAO_KEY, tempo);

    const msg = document.getElementById("mensagem-sucesso");
    msg.style.display = "block";
    setTimeout(() => (msg.style.display = "none"), 2000);
  });

  document.getElementById("tempo-expiracao").addEventListener("change", (e) => {
    atualizarAvisoSenha(e.target.value);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  carregarConfiguracoes();
  configurarListeners();
});
