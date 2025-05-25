export function configurarGerenciar() {
  const lista = document.getElementById("lista-chaves");
  if (!lista) return;

  const chavesMock = [
    { id: "1", nome: "GitHub", segredo: "ABC123" },
    { id: "2", nome: "Google", segredo: "XYZ456" },
  ];

  lista.innerHTML = "";

  chavesMock.forEach((chave) => {
    const item = document.createElement("div");
    item.className = "chave-item";
    item.innerHTML = `
      <div class="info">
        <strong>${chave.nome}</strong><br />
        <code>${chave.segredo}</code>
      </div>
      <div class="acoes">
        <button class="editar" data-id="${chave.id}">✏️</button>
        <button class="remover" data-id="${chave.id}">🗑️</button>
      </div>
    `;
    lista.appendChild(item);
  });
}
