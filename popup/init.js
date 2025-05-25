import { mostrarView } from "./views.js";
import { atualizarTotps } from "./totpCycle.js";
import { configurarPrivacidadeOverlay } from "./overlay.js";
import { inicializarSeguranca, criarSenhaMestre, logarComSenha } from "./auth.js";
import { carregarChaves, salvarNovaChave } from "./events.js";
import { listarChaves } from "../lib/db.js";
import { derivarChave, descriptografarSegredo } from "../lib/vault.js";

const chaveCryptoRef = { current: null };

function configurarViewToggle() {
  document.getElementById("abrir-formulario")?.addEventListener("click", () => {
    mostrarView("view-adicionar");
  });

  document.getElementById("cancelar-form")?.addEventListener("click", () => {
    mostrarView("view-lista");
  });
}

function getExpiracaoConfig() {
  return localStorage.getItem("tempoExpiracao") ?? "0";
}

function sessaoAindaValida() {
  const modo = getExpiracaoConfig();
  const inicio = localStorage.getItem("expiracao.inicio");
  const boot = localStorage.getItem("expiracao.boot");
  const agora = Date.now();

  if (modo === "forever") return sessionStorage.getItem("senhaMestre") !== null;
  if (modo === "session") return sessionStorage.getItem("expiracao.session") === "ativa";
  if (modo === "boot") return boot !== null;
  if (modo === "5") return agora - inicio < 5 * 60 * 1000;
  if (modo === "30") return agora - inicio < 30 * 60 * 1000;

  return false;
}

function registrarInicioSessao() {
  const modo = getExpiracaoConfig();
  const agora = Date.now();
  localStorage.setItem("expiracao.inicio", agora);

  if (modo === "session") {
    sessionStorage.setItem("expiracao.session", "ativa");
  } else if (modo === "boot") {
    localStorage.setItem("expiracao.boot", "1");
  }

  if (modo === "5") {
    setTimeout(() => sessionStorage.removeItem("senhaMestre"), 5 * 60 * 1000);
  } else if (modo === "30") {
    setTimeout(() => sessionStorage.removeItem("senhaMestre"), 30 * 60 * 1000);
  }
}

function limparSessao() {
  sessionStorage.removeItem("expiracao.session");
  sessionStorage.removeItem("senhaMestre");
  localStorage.removeItem("expiracao.boot");
  localStorage.removeItem("expiracao.inicio");
  chaveCryptoRef.current = null;
}

function prosseguir() {
  mostrarView("view-lista");
  carregarChaves(chaveCryptoRef.current);
  atualizarTotps();
  setInterval(() => atualizarTotps(), 1000);
  registrarInicioSessao();
}

document.addEventListener("DOMContentLoaded", async () => {
  await inicializarSeguranca();
  configurarViewToggle();
  configurarPrivacidadeOverlay();

  if (sessaoAindaValida()) {
    const senha = sessionStorage.getItem("senhaMestre");
    if (senha) {
      const db = await indexedDB.open("2KeyDB");
      const tx = db.result.transaction("meta");
      const saltReq = tx.objectStore("meta").get("salt");
      saltReq.onsuccess = async () => {
        if (saltReq.result) {
          chaveCryptoRef.current = await derivarChave(senha, saltReq.result);
          prosseguir();
        }
      };
      return;
    }
  }

  document.getElementById("form-senha-inicial")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const senha = e.target.senha.value.trim();
    if (!senha) return;

    chaveCryptoRef.current = await criarSenhaMestre(senha);
    sessionStorage.setItem("senhaMestre", senha);
    prosseguir();
  });

  document.getElementById("form-login")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const senha = e.target.senha.value.trim();
    if (!senha) return;

    try {
      chaveCryptoRef.current = await logarComSenha(senha);
      const chaves = await listarChaves();
      sessionStorage.setItem("senhaMestre", senha);

      if (chaves.length === 0) return prosseguir();

      await descriptografarSegredo(
        chaveCryptoRef.current,
        new Uint8Array(chaves[0].segredoCriptografado),
        new Uint8Array(chaves[0].iv)
      );

      prosseguir();
    } catch {
      document.getElementById("erro-login").style.display = "block";
      limparSessao();
    }
  });

  document.getElementById("form-chave")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    const nome = form.nome.value.trim();
    const segredo = form.chave.value.trim();
    if (!nome || !segredo || !chaveCryptoRef.current) return;

    await salvarNovaChave(chaveCryptoRef.current, nome, segredo);
    form.reset();
  });
});

document.getElementById("abrir-config")?.addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});
