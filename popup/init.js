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

function prosseguir() {
  mostrarView("view-lista");
  carregarChaves(chaveCryptoRef.current);
  atualizarTotps();

  setInterval(() => atualizarTotps(), 1000);
}

document.addEventListener("DOMContentLoaded", async () => {
  await inicializarSeguranca();

  configurarViewToggle();
  configurarPrivacidadeOverlay();

  document.getElementById("form-senha-inicial")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const senha = e.target.senha.value.trim();
    if (!senha) return;

    chaveCryptoRef.current = await criarSenhaMestre(senha);
    prosseguir();
  });

  document.getElementById("form-login")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const senha = e.target.senha.value.trim();
    if (!senha) return;

    try {
      chaveCryptoRef.current = await logarComSenha(senha);
      const chaves = await listarChaves();
      if (chaves.length === 0) return prosseguir();

      await descriptografarSegredo(
        chaveCryptoRef.current,
        new Uint8Array(chaves[0].segredoCriptografado),
        new Uint8Array(chaves[0].iv)
      );

      prosseguir();
    } catch {
      document.getElementById("erro-login").style.display = "block";
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
