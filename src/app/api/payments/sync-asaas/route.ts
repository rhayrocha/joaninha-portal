import { NextResponse } from 'next/server';
import { asaas } from '@/lib/asaas';
import { mockPayments } from '@/data/mockPayments';
import { getAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const apiKey = process.env.ASAAS_API_KEY;
  const env = process.env.ASAAS_ENVIRONMENT || 'sandbox';

  if (!apiKey) {
    return NextResponse.json({ error: 'ASAAS_API_KEY não configurada' }, { status: 400 });
  }

  try {
    const baseUrl = env === 'production'
      ? 'https://api.asaas.com/v3'
      : 'https://sandbox.asaas.com/api/v3';

    // 1. Obter ou garantir o cliente Maria Clara Santos no Asaas
    const customer = await asaas.getOrCreateCustomer({
      name: "Maria Clara Santos (Mãe do Pedro)",
      cpfCnpj: "456.789.123-00",
      email: "maria.santos@exemplo.com.br",
      mobilePhone: "11987654321",
      externalReference: "parent_001",
    });

    // 2. Buscar pagamentos existentes no Asaas
    const listRes = await fetch(`${baseUrl}/payments?limit=100`, {
      headers: {
        'Content-Type': 'application/json',
        'access_token': apiKey,
      },
      cache: 'no-store',
    });

    if (!listRes.ok) {
      throw new Error('Falha ao consultar cobranças existentes no Asaas');
    }

    const asaasData = await listRes.json();
    const existingPayments = asaasData.data || [];

    // 3. Identificar quais mensalidades do mock ainda NÃO estão no Asaas
    const todayStr = new Date().toISOString().split('T')[0];
    const created: any[] = [];
    const skipped: any[] = [];

    // Focar nas cobranças de Pedro Henrique
    const targetPayments = mockPayments.filter(p => p.childName.includes('Pedro'));

    for (const payment of targetPayments) {
      const refMonth = payment.reference.split('/')[0].toLowerCase();
      
      const alreadyExists = existingPayments.some((ap: any) => 
        (ap.description || '').toLowerCase().includes(refMonth)
      );

      if (alreadyExists) {
        skipped.push({ reference: payment.reference, reason: 'Já existe no Asaas' });
        continue;
      }

      // Se a data de vencimento for no passado, o Asaas recusa. Ajustamos para hoje + 2 dias se vencido
      let dueDate = payment.dueDate;
      if (dueDate < todayStr) {
        // Vencimento ajustado para D+2
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 2);
        dueDate = targetDate.toISOString().split('T')[0];
      }

      const description = `Mensalidade Escolar - ${payment.reference} - ${payment.childName}`;

      const newCharge = await asaas.createPayment({
        customerId: customer.id,
        value: payment.amount,
        dueDate,
        description,
        billingType: 'UNDEFINED',
        discountValue: payment.discount > 0 ? payment.discount : undefined,
        discountDaysBeforeDue: 0,
        externalReference: payment.id,
      });

      // Persiste também no Supabase
      try {
        const supabase = getAdminClient();
        await supabase.from('payments').upsert({
          parent_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
          student_id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22',
          asaas_payment_id: newCharge.id,
          asaas_customer_id: customer.id,
          title: `Mensalidade - ${payment.reference}`,
          description,
          amount: newCharge.value,
          discount_amount: payment.discount || 0,
          final_amount: newCharge.value,
          due_date: newCharge.dueDate,
          status: newCharge.status === 'RECEIVED' ? 'paid' : 'pending',
          billing_type: 'PIX',
          invoice_url: newCharge.invoiceUrl,
        }, { onConflict: 'asaas_payment_id' });
      } catch (dbErr) {
        console.warn('[Sync Asaas] Aviso ao salvar payment no Supabase:', dbErr);
      }

      created.push({
        id: newCharge.id,
        reference: payment.reference,
        value: newCharge.value,
        dueDate: newCharge.dueDate,
        status: newCharge.status,
      });
    }

    return NextResponse.json({
      success: true,
      message: `${created.length} cobrança(s) gerada(s) com sucesso no Asaas Sandbox!`,
      created,
      skipped,
      totalAsaasNow: existingPayments.length + created.length,
    });
  } catch (error: any) {
    console.error('[API Sync Asaas] Erro:', error);
    return NextResponse.json({ 
      error: error.message || 'Erro ao sincronizar com Asaas' 
    }, { status: 500 });
  }
}
