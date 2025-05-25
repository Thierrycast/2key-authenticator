import { derivarChave } from "../lib/vault.js";
import { abrirDB, salvarMeta, lerMeta } from "../lib/db.js";
import { mostrarView } from "./views.js";

export async function inicializarSeguranca() {
  const salt = await lerMeta("salt");
  if (!salt) {
    mostrarView("view-inicial");
  } else {
    mostrarView("view-login");
  }
}

export async function criarSenhaMestre(senha) {
  const db = await abrirDB();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  await salvarMeta("salt", salt);
  return await derivarChave(senha, salt);
}

export async function logarComSenha(senha) {
  const salt = await lerMeta("salt");
  return await derivarChave(senha, salt);
}
