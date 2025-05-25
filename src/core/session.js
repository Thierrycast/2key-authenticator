export function getExpiracaoConfig() {
  return localStorage.getItem("tempoExpiracao") ?? "0";
}

export function sessaoAindaValida() {
  const modo = getExpiracaoConfig();
  const inicio = parseInt(localStorage.getItem("expiracao.inicio") ?? "0", 10);
  const boot = localStorage.getItem("expiracao.boot");
  const agora = Date.now();
  const senha = localStorage.getItem("senhaMestre");

  if (!senha) return false;

  if (modo === "forever") return true;
  if (modo === "session") return sessionStorage.getItem("expiracao.session") === "ativa";
  if (modo === "boot") return boot !== null;
  if (modo === "5") return agora - inicio < 5 * 60 * 1000;
  if (modo === "30") return agora - inicio < 30 * 60 * 1000;

  return false;
}

export function registrarInicioSessao() {
  const modo = getExpiracaoConfig();
  const agora = Date.now();
  localStorage.setItem("expiracao.inicio", agora.toString());

  if (modo === "session") {
    sessionStorage.setItem("expiracao.session", "ativa");
  } else if (modo === "boot") {
    localStorage.setItem("expiracao.boot", "1");
  }

}

export function limparSessao() {
  sessionStorage.removeItem("expiracao.session");
  localStorage.removeItem("senhaMestre");
  localStorage.removeItem("expiracao.boot");
  localStorage.removeItem("expiracao.inicio");
}