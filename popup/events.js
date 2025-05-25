import { salvarChave, listarChaves } from "../lib/db.js";
import { descriptografarSegredo, criptografarSegredo } from "../lib/vault.js";
import { renderCodigos } from "./render.js";
import { atualizarTotps } from "./totpCycle.js";
import { mostrarView } from "./views.js";

export async function carregarChaves(chaveCrypto) {
  const chaves = await listarChaves();

  const desencriptadas = await Promise.all(
    chaves.map(async (item) => {
      try {
        const segredo = await descriptografarSegredo(
          chaveCrypto,
          new Uint8Array(item.segredoCriptografado),
          new Uint8Array(item.iv)
        );
        return { nome: item.nome, segredo };
      } catch {
        return null;
      }
    })
  );

  renderCodigos(desencriptadas.filter(Boolean));
}

export async function salvarNovaChave(chaveCrypto, nome, segredo) {
  const id = nome.toLowerCase().replace(/\s+/g, "-");
  const { cifrado, iv } = await criptografarSegredo(chaveCrypto, segredo);

  await salvarChave({
    id,
    nome,
    segredoCriptografado: Array.from(cifrado),
    iv: Array.from(iv)
  });

  await carregarChaves(chaveCrypto);
  atualizarTotps();
  mostrarView("view-lista");
}
