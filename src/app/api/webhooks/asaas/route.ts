import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

/**
 * Webhook Oficial do Asaas para Notificações de Pagamentos em Tempo Real
 * Documentação: https://docs.asaas.com/reference/webhook-para-cobrancas
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Verificação de Token de Autenticação do Webhook
    const webhookToken = req.headers.get('asaas-access-token') || req.headers.get('access_token');
    const expectedToken = process.env.ASAAS_WEBHOOK_SECRET;

    if (expectedToken && webhookToken !== expectedToken) {
      console.warn('[Webhook Asaas] Tentativa de acesso não autorizada: Token inválido');
      return NextResponse.json({ error: 'Unauthorized: Token inválido' }, { status: 401 });
    }

    const body = await req.json();
    const { event, payment } = body;

    console.log(`[Webhook Asaas Sandbox] Evento recebido: ${event} para cobrança ${payment?.id}`);

    // 2. Tratamento dos Eventos de Ciclo de Vida do Pagamento com Persistência no Supabase
    try {
      const supabase = getAdminClient();

      switch (event) {
        case 'PAYMENT_RECEIVED':
        case 'PAYMENT_CONFIRMED':
          console.log(`✅ [Pagamento Confirmado] Cobrança ${payment.id} no valor de R$ ${payment.value} foi liquidada via ${payment.billingType}!`);
          await supabase
            .from('payments')
            .update({
              status: 'paid',
              paid_at: payment.paymentDate || payment.clientPaymentDate || new Date().toISOString(),
            })
            .eq('asaas_payment_id', payment.id);
          break;

        case 'PAYMENT_OVERDUE':
          console.log(`⚠️ [Pagamento Vencido] Cobrança ${payment.id} venceu sem liquidação.`);
          await supabase
            .from('payments')
            .update({ status: 'overdue' })
            .eq('asaas_payment_id', payment.id);
          break;

        case 'PAYMENT_DELETED':
        case 'PAYMENT_REFUNDED':
          console.log(`ℹ️ [Pagamento Cancelado/Estornado] Cobrança ${payment.id}`);
          await supabase
            .from('payments')
            .update({ status: 'cancelled' })
            .eq('asaas_payment_id', payment.id);
          break;

        default:
          console.log(`[Webhook Asaas] Evento informativo ignorado: ${event}`);
      }
    } catch (dbErr) {
      console.warn('[Webhook Asaas] Aviso ao persistir no Supabase:', dbErr);
    }

    // Retorna 200 OK para confirmar ao Asaas que a mensagem foi recebida com sucesso
    return NextResponse.json({ received: true, event, paymentId: payment?.id });
  } catch (error) {
    console.error('[Webhook Asaas] Erro ao processar evento:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
