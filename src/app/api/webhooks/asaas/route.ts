import { NextRequest, NextResponse } from 'next/server';

/**
 * Webhook Oficial do Asaas para Notificações de Pagamentos em Tempo Real
 * Documentação: https://docs.asaas.com/reference/webhook-para-cobrancas
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Verificação de Token de Autenticação do Webhook
    const webhookToken = req.headers.get('asaas-access-token');
    const expectedToken = process.env.ASAAS_WEBHOOK_SECRET;

    if (expectedToken && webhookToken !== expectedToken) {
      console.warn('[Webhook Asaas] Tentativa de acesso não autorizada: Token inválido');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { event, payment } = body;

    console.log(`[Webhook Asaas Sandbox] Evento recebido: ${event} para cobrança ${payment?.id}`);

    // 2. Tratamento dos Eventos de Ciclo de Vida do Pagamento
    switch (event) {
      case 'PAYMENT_RECEIVED':
      case 'PAYMENT_CONFIRMED':
        console.log(`✅ [Pagamento Confirmado] Cobrança ${payment.id} no valor de R$ ${payment.value} foi liquidada via ${payment.billingType}!`);
        // Aqui o banco de dados é atualizado para status: 'paid' e paid_at: payment.paymentDate
        break;

      case 'PAYMENT_OVERDUE':
        console.log(`⚠️ [Pagamento Vencido] Cobrança ${payment.id} venceu sem liquidação.`);
        // Aqui o banco de dados é atualizado para status: 'overdue'
        break;

      case 'PAYMENT_DELETED':
      case 'PAYMENT_REFUNDED':
        console.log(`ℹ️ [Pagamento Cancelado/Estornado] Cobrança ${payment.id}`);
        // Aqui o banco de dados é atualizado para status: 'cancelled'
        break;

      default:
        console.log(`[Webhook Asaas] Evento informativo ignorado: ${event}`);
    }

    // Retorna 200 OK para confirmar ao Asaas que a mensagem foi recebida com sucesso
    return NextResponse.json({ received: true, event, paymentId: payment?.id });
  } catch (error) {
    console.error('[Webhook Asaas] Erro ao processar evento:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
