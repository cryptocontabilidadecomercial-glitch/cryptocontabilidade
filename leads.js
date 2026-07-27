/* ============================================================
   CRYPTO Contabilidade — envio central de leads
   1) Cole abaixo a URL do seu Google Apps Script (ver README-LEADS.md)
   2) Enquanto vazio, os formulários usam o WhatsApp como fallback
   ============================================================ */
const LEAD_ENDPOINT = "https://script.google.com/macros/s/AKfycbydDy5rdvAME2aVsBvzC59u5pwsxeZyu3Qb272ufg3dnqPtB8fpgpRazq1y6RvQvdHH-A/exec"; // ex.: "https://script.google.com/macros/s/XXXX/exec"
const WHATS_FALLBACK = "5500000000000"; // número do WhatsApp com DDI+DDD

function validarTelefone(t) {
  const d = (t || "").replace(/\D/g, "");
  return d.length >= 10 && d.length <= 13; // fixo/celular BR, com ou sem DDI
}

function validarEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((e || "").trim());
}

/* dados = {origem, item, nome, empresa, telefone, email, cidade, obs} */
async function enviarLead(dados, btn, sucessoEl) {
  if (!dados.nome || !dados.empresa || !dados.telefone || !dados.email || !dados.cidade) {
    alert("Preencha todos os campos para receber o material."); return false;
  }
  if (!validarTelefone(dados.telefone)) {
    alert("Verifique o telefone: informe DDD + número (10 a 11 dígitos)."); return false;
  }
  if (!validarEmail(dados.email)) {
    alert("Verifique o e-mail informado."); return false;
  }

  if (btn) { btn.disabled = true; btn.textContent = "Enviando..."; }

  if (LEAD_ENDPOINT) {
    try {
      await fetch(LEAD_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(dados).toString()
      });
      if (sucessoEl) sucessoEl.style.display = "block";
      if (btn) { btn.textContent = "Enviado ✓"; }
      return true;
    } catch (err) {
      if (btn) { btn.disabled = false; btn.textContent = "Tentar novamente"; }
      alert("Não foi possível enviar agora. Tente novamente em instantes.");
      return false;
    }
  }

  /* Fallback: endpoint ainda não configurado → WhatsApp */
  const linhas = [
    `Olá! [${dados.origem}]`,
    `*Item:* ${dados.item}`,
    `*Nome:* ${dados.nome}`,
    `*Empresa:* ${dados.empresa}`,
    `*Telefone:* ${dados.telefone}`,
    `*E-mail:* ${dados.email}`,
    `*Cidade:* ${dados.cidade}`,
    `*Obs:* ${dados.obs || "-"}`
  ];
  window.open(`https://wa.me/${WHATS_FALLBACK}?text=${encodeURIComponent(linhas.join("\n"))}`, "_blank");
  if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || "Enviar"; }
  if (sucessoEl) sucessoEl.style.display = "block";
  return true;
}
