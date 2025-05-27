import { mostrarView } from "./ui/views.js";
import { atualizarTotps } from "./logic/totpCycle.js";
import { configurarPrivacidadeOverlay } from "./ui/overlay.js";
import { inicializarSeguranca,criarSenhaMestre, logarComSenha} from "./logic/auth.js";
import { carregarChaves, salvarNovaChave} from "./logic/events.js";
import { listarChaves, lerMeta } from "../storage/db.js";
import { derivarChave, descriptografarSegredo} from "../core/cryptoVault.js";
import { sessaoAindaValida, registrarInicioSessao,limparSessao} from "../core/session.js";

const chaveCryptoRef = { current: null };

function configurarViewToggle() {
  document.getElementById("abrir-formulario")?.addEventListener("click", () => {
    mostrarView("view-adicionar");
  });

  document.getElementById("cancelar-form")?.addEventListener("click", () => {
    mostrarView("view-lista");
  });
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
    const senha = localStorage.getItem("senhaMestre");
    if (senha) {
      const salt = await lerMeta("salt");
      if (salt) {
        chaveCryptoRef.current = await derivarChave(senha, salt);
        prosseguir();
        return;
      }
    }
  }

  document.getElementById("form-senha-inicial")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const senha = e.target.senha.value.trim();
    const erroEl = document.getElementById("erro-senha-inicial");
    erroEl.textContent = "";
    erroEl.style.opacity = "0";

    if (!senha) return;

    try {
      chaveCryptoRef.current = await criarSenhaMestre(senha);
      localStorage.setItem("senhaMestre", senha);
      prosseguir();
    } catch (err) {
      erroEl.textContent = err.message || "Erro ao criar senha";
      erroEl.style.opacity = "1";
      setTimeout(() => {
        erroEl.style.opacity = "0";
      }, 3000);
    }
  });

  document.getElementById("form-login")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const senha = e.target.senha.value.trim();
    if (!senha) return;

    try {
      chaveCryptoRef.current = await logarComSenha(senha);
      const chaves = await listarChaves();
      localStorage.setItem("senhaMestre", senha);

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

  document.querySelector('input[name="link"]')?.addEventListener("input", (e) => {
    const valor = e.target.value.trim();
    if (!valor.startsWith("otpauth://")) return;

    try {
      const url = new URL(valor);
      const secret = url.searchParams.get("secret");
      const label = decodeURIComponent(url.pathname.slice(1));

      if (secret) {
        const inputSegredo = document.querySelector('input[name="chave"]');
        const inputNome = document.querySelector('input[name="nome"]');

        if (inputSegredo) inputSegredo.value = secret;
        if (inputNome && inputNome.value.trim() === "") {
          inputNome.value = label || "Nova Conta";
        }
      }
    } catch (err) {
      console.warn("Erro ao interpretar link otpauth:", err);
    }
  });
});

document.getElementById("abrir-config")?.addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});

document.getElementById("esqueci-senha-link")?.addEventListener("click", () => {
  mostrarView("view-redefinir");
});

document.getElementById("botao-redefinir")?.addEventListener("click", () => {
  document.getElementById("modal-confirmar-reset").style.display = "flex";
});

document.getElementById("cancelar-reset")?.addEventListener("click", () => {
  document.getElementById("modal-confirmar-reset").style.display = "none";
});

document.getElementById("confirmar-reset")?.addEventListener("click", async () => {
  const botao = document.getElementById("confirmar-reset");
  botao.classList.add("loading");
  botao.textContent = "Apagando...";

  botao.disabled = true;

  localStorage.clear();
  sessionStorage.clear();

  const req = indexedDB.deleteDatabase("2KeyDB");

  req.onsuccess = () => {
    document.getElementById("modal-confirmar-reset").style.display = "none";
    botao.classList.remove("loading");
    botao.textContent = "Redefinir";
    botao.disabled = false;

    mostrarView("view-inicial");
  };

  req.onerror = () => {
    alert("Erro ao apagar dados.");
    botao.classList.remove("loading");
    botao.textContent = "Redefinir";
    botao.disabled = false;
  };
});
