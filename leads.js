/* ============================================================
   CRYPTO Contabilidade — envio central de leads
   Cole a URL do Google Apps Script em LEAD_ENDPOINT (termina em /exec)
   ============================================================ */
const LEAD_ENDPOINT = "https://script.google.com/macros/s/AKfycbydDy5rdvAME2aVsBvzC59u5pwsxeZyu3Qb272ufg3dnqPtB8fpgpRazq1y6RvQvdHH-A/exec";

/* dados = {origem, item, nome, empresa, telefone, email, cidade, obs} */
async function enviarLead(dados, btn, sucessoEl) {
  if (!dados.nome || !dados.empresa || !dados.telefone || !dados.email || !dados.cidade) {
    alert("Preencha todos os campos, por favor."); return false;
  }
  const digitos = (dados.telefone || "").replace(/\D/g, "");
  if (digitos.length < 8) {
    alert("O telefone parece incompleto. Confira, por favor."); return false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email.trim())) {
    alert("Verifique o e-mail informado."); return false;
  }
  if (!LEAD_ENDPOINT) {
    alert("Envio em manutenção. Por favor, chame no WhatsApp: (12) 99111-6084"); return false;
  }

  if (btn) { btn.disabled = true; btn.textContent = "Enviando..."; }
  try {
    await fetch(LEAD_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(dados).toString()
    });
    if (sucessoEl) sucessoEl.style.display = "block";
    if (btn) btn.textContent = "Enviado ✓";
    return true;
  } catch (err) {
    if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || "Enviar"; }
    alert("Não foi possível enviar agora. Tente novamente ou chame no WhatsApp: (12) 99111-6084");
    return false;
  }
}
