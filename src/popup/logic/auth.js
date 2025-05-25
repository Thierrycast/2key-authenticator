import { derivarChave, getOrCreateSalt } from "../../core/cryptoVault.js";
import { abrirDB, salvarMeta, lerMeta } from "../../storage/db.js";
import { mostrarView } from "../ui/views.js";

export async function inicializarSeguranca() {
  const salt = await lerMeta("salt");
  if (!salt) {
    mostrarView("view-inicial");
  } else {
    mostrarView("view-login");
  }
}

export async function criarSenhaMestre(senha) {
  if (senha.length < 6) throw new Error("Senha muito curta");
  const db = await abrirDB();
  const salt = await getOrCreateSalt(db);
  return await derivarChave(senha, salt);
}

export async function logarComSenha(senha) {
  const salt = await lerMeta("salt");
  return await derivarChave(senha, salt);
}