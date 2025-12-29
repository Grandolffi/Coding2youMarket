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

const enviarEmailPedidoRecorrente = async ({ email, nome, pedidoId, valorTotal, dataEntrega, itens }) => {
  // Se não tem Resend configurado, apenas loga
  if (!resend) {
    console.log(`📧 [DEV] Email de pedido recorrente seria enviado para ${email}`);
    return { id: 'dev-mode' };
  }

  try {
    // Formatar lista de itens
    const listaItens = itens.map(item =>
      `<li>${item.quantidade}x ${item.nome || 'Produto'} - R$ ${item.preco.toFixed(2)}</li>`
    ).join('');

    const { data, error } = await resend.emails.send({
      from: 'Subscrivery <onboarding@resend.dev>',
      to: email,
      subject: `🔄 Nova entrega da sua assinatura - Pedido #${pedidoId}`,
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px;">
          <h2>Olá, ${nome}! 👋</h2>
          <p>Sua assinatura gerou um novo pedido automaticamente!</p>
          
          <div style="background-color: #F0F8F5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #2F6B4F;">📦 Pedido #${pedidoId}</h3>
            <p><strong>Data de entrega prevista:</strong> ${dataEntrega}</p>
            <p><strong>Valor total:</strong> R$ ${valorTotal.toFixed(2)}</p>
            
            <h4>Itens do pedido:</h4>
            <ul style="list-style: none; padding-left: 0;">
              ${listaItens}
            </ul>
          </div>

          <p>Você pode acompanhar seu pedido acessando o aplicativo:</p>
          <a href="https://subscrivery.vercel.app/meus-pedidos" 
             style="display: inline-block; background-color: #2F6B4F; color: white; 
                    padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0;">
            Ver Meus Pedidos
          </a>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
          <small style="color: #666;">
            Este é um email automático da sua assinatura. Se você cancelou sua assinatura, 
            por favor desconsidere esta mensagem.
          </small>
        </div>
      `
    });

    if (error) {
      console.error(`❌ Erro ao enviar email para ${email}:`, error);
      throw error;
    }

    console.log(`✅ Email de pedido recorrente enviado para ${email}. ID: ${data.id}`);
    return data;
  } catch (err) {
    console.error(`❌ Erro ao enviar email para ${email}:`, err);
    // Não lançar erro para não bloquear o CRON
    return null;
  }
};

module.exports = { enviarEmailCodigo, enviarEmailPedidoRecorrente };