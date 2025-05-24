const codigosMock = [
  { nome: "GitHub", valor: "123 456" },
  { nome: "Google", valor: "987 654" },
  { nome: "Discord", valor: "654 321" },
  { nome: "Instagram", valor: "321 987" },
  { nome: "Spotify", valor: "456 789" },
  { nome: "ClickUp", valor: "789 321" },
  { nome: "AWS", valor: "101 010" },
];

function renderCodigos(lista) {
  const container = document.getElementById("lista-codigos");
  container.innerHTML = "";

  lista.forEach((item) => {
    const div = document.createElement("div");
    div.className = "codigo";
    div.innerHTML = `
      <p class="nome">${item.nome}</p>
      <p class="valor">${item.valor}</p>
      <div class="linha" />
    `;
    container.appendChild(div);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderCodigos(codigosMock);

  document.getElementById("abrir-formulario").addEventListener("click", () => {
    document.getElementById("view-lista").style.display = "none";
    document.getElementById("view-adicionar").style.display = "flex";
  });

  document.getElementById("cancelar-form").addEventListener("click", () => {
    document.getElementById("view-adicionar").style.display = "none";
    document.getElementById("view-lista").style.display = "flex";
  });
});
