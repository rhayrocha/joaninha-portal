import { NextResponse } from 'next/server';
import { asaas } from '@/lib/asaas';
import { getAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const apiKey = process.env.ASAAS_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'ASAAS_API_KEY não configurada' }, { status: 400 });
  }

  try {
    let parentId: string | null = null;
    try {
      const body = await req.json();
      parentId = body.parentId || null;
    } catch {
      // Sem body JSON
    }

    const supabase = getAdminClient();

    // Se nenhum parentId foi passado, busca a primeira família cadastrada
    if (!parentId) {
      const { data: firstParent } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'parent')
        .limit(1)
        .single();
      
      parentId = firstParent?.id || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    }

    // 1. Busca os dados do responsável e do(s) aluno(s) no Supabase
    const { data: parentProfile, error: parentError } = await supabase
      .from('profiles')
      .select('*, students(*)')
      .eq('id', parentId)
      .single();

    if (parentError || !parentProfile) {
      return NextResponse.json({ error: 'Responsável não encontrado no sistema' }, { status: 404 });
    }

    const student = parentProfile.students && parentProfile.students.length > 0
      ? parentProfile.students[0]
      : { id: null, full_name: 'Aluno(a)' };

    // 2. Garante o cliente no Asaas
    const customer = await asaas.getOrCreateCustomer({
      name: `${parentProfile.full_name} (Resp. ${student.full_name})`,
      cpfCnpj: parentProfile.cpf || '456.789.123-00',
      email: parentProfile.email,
      mobilePhone: parentProfile.phone || '11987654321',
      externalReference: parentProfile.id,
    });

    // 3. Define as mensalidades a serem geradas (Setembro e Outubro)
    const targetMonths = [
      {
        ref: 'Setembro/2026',
        dueDate: '2026-09-15',
        amount: 2200,
        discount: 100,
        status: 'pending',
      },
      {
        ref: 'Outubro/2026',
        dueDate: '2026-10-10',
        amount: 2200,
        discount: 100,
        status: 'pending',
      }
    ];

    const todayStr = new Date().toISOString().split('T')[0];
    const created: any[] = [];

    for (const item of targetMonths) {
      let dueDate = item.dueDate;
      if (dueDate < todayStr) {
        const d = new Date();
        d.setDate(d.getDate() + 5);
        dueDate = d.toISOString().split('T')[0];
      }

      const description = `Mensalidade Escolar - ${item.ref} - ${student.full_name}`;

      // Cria a cobrança no Asaas
      const newCharge = await asaas.createPayment({
        customerId: customer.id,
        value: item.amount,
        dueDate,
        description,
        billingType: 'PIX',
        discountValue: item.discount,
        discountDaysBeforeDue: 0,
        externalReference: `${parentId}_${item.ref}`,
      });

      // Tenta obter o QR Code do Pix imediatamente
      let pixQrCode = '';
      let pixImage = '';
      try {
        const pixData = await asaas.getPixQrCode(newCharge.id);
        pixQrCode = pixData.payload || '';
        pixImage = pixData.encodedImage || '';
      } catch (pixErr) {
        console.warn('[Sync Asaas] Não foi possível obter Pix imediato:', pixErr);
      }

      // Salva no Supabase vinculado ao responsável e aluno
      await supabase.from('payments').upsert({
        parent_id: parentId,
        student_id: student.id,
        asaas_payment_id: newCharge.id,
        asaas_customer_id: customer.id,
        title: `Mensalidade - ${item.ref}`,
        description,
        amount: item.amount,
        discount_amount: item.discount,
        final_amount: item.amount - item.discount,
        due_date: dueDate,
        status: 'pending',
        billing_type: 'PIX',
        invoice_url: newCharge.invoiceUrl,
        pix_copy_paste: pixQrCode || null,
        pix_qr_code_image: pixImage || null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'asaas_payment_id' });

      created.push({
        id: newCharge.id,
        reference: item.ref,
        studentName: student.full_name,
        value: item.amount,
        dueDate,
      });
    }

    return NextResponse.json({
      success: true,
      message: `${created.length} mensalidade(s) gerada(s) no Asaas Sandbox para ${parentProfile.full_name}!`,
      customer: customer.name,
      created,
    });
  } catch (error: any) {
    console.error('[API Sync Asaas Error]:', error);
    return NextResponse.json({
      error: error.message || 'Erro ao sincronizar cobranças com Asaas',
    }, { status: 500 });
  }
}
