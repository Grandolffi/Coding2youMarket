const { Resend } = require('resend');

// Inicializa o cliente Resend com a API Key
const apiKey = process.env.RESEND_API_KEY;

let resend = null;

if (!apiKey) {
  console.warn("⚠️  RESEND_API_KEY não configurada! Emails não serão enviados.");
} else {
  resend = new Resend(apiKey);
  console.log("✅ Resend configurado com sucesso!");
}

const enviarEmailCodigo = async (emailDestino, codigo) => {
  // Se não tem Resend configurado, apenas loga
  if (!resend) {
    console.log(`📧 [DEV] Código seria enviado para ${emailDestino}: ${codigo}`);
    return { id: 'dev-mode' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Subscrivery <onboarding@resend.dev>', // Use este email para teste
      to: emailDestino,
      subject: "Seu código de verificação - Subscrivery",
      html: `
        <div style="font-family: sans-serif; color: #333;">
          <h2>Olá!</h2>
          <p>Você solicitou um código de verificação para sua conta no <b>Subscrivery</b>.</p>
          <div style="background-color: #F4F4F4; padding: 20px; text-align: center; border-radius: 8px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2F6B4F;">
              ${codigo}
            </span>
          </div>
          <p>Este código expira em 10 minutos.</p>
          <hr />
          <small>Se você não solicitou este e-mail, por favor o ignore.</small>
        </div>
      `
    });

    if (error) {
      console.error(`❌ Erro Resend ao enviar para ${emailDestino}:`, error);
      throw error;
    }

    console.log(`✅ Email enviado com sucesso para ${emailDestino}. ID: ${data.id}`);
    return data;
  } catch (err) {
    console.error(`❌ Erro ao enviar email para ${emailDestino}:`, err);
    throw err;
  }
};

module.exports = { enviarEmailCodigo };