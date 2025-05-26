import { gerarTOTP } from "../../core/totp.js";

export async function atualizarTotps() {
  const elementos = document.querySelectorAll(".valor");
  const agora = Date.now();
  const tempoAtual = Math.floor(agora / 1000);
  const segundosRestantes = 30 - (tempoAtual % 30);
  const progresso = (segundosRestantes / 30) * 100;

  for (const el of elementos) {
    const segredo = el.dataset.segredo;
    try {
      const codigo = await gerarTOTP(segredo);
      el.textContent = `${codigo.slice(0, 3)} ${codigo.slice(3)}`;
    } catch {
      el.textContent = "Erro";
      el.style.color = "#f87171";
    }

    if (segundosRestantes <= 5) {
      el.style.color = "#f87171";
      el.classList.add("piscar");
    } else {
      el.style.color = "#60a5fa";
      el.classList.remove("piscar");
    }

    const barra = el.parentElement.parentElement.querySelector(".tempo-preenchido");
    if (barra) {
      barra.style.width = `${progresso}%`;
      barra.style.backgroundColor = segundosRestantes <= 5 ? "#f87171" : "#3b82f6";
    }
  }
}