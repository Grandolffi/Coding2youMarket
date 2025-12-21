const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Teste de conexão
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Erro na conexão: Verifique se o caminho do .env está correto.");
  } else {
    console.log("✅ Conexão estabelecida com sucesso usando .env!");
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