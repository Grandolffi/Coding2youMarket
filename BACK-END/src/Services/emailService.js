const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,              // Porta 587 com STARTTLS (geralmente não bloqueada)
  secure: false,          // false para porta 587 (usa STARTTLS)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false  // Permite certificados auto-assinados
  }
});


// Teste de conexão SMTP na inicialização
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ ERRO SMTP - Conexão falhou:");
    console.error("   Detalhes:", error.message);
    console.error("   EMAIL_USER configurado:", process.env.EMAIL_USER ? "Sim" : "NÃO!");
    console.error("   EMAIL_PASS configurado:", process.env.EMAIL_PASS ? "Sim" : "NÃO!");
  } else {
    console.log("✅ SMTP conectado com sucesso! Pronto para enviar emails.");
  }
});


const enviarEmailCodigo = async (emailDestino, codigo) => {
  const mailOptions = {
    from: '"Subscrivery ☕" <brunofujisao2018@gmail.com>',
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
  };

  return transporter.sendMail(mailOptions);

};

module.exports = { enviarEmailCodigo };