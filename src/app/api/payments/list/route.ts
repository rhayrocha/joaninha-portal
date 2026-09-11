import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import type { Payment } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const parentId = searchParams.get('parentId');

    const supabase = getAdminClient();

    let query = supabase
      .from('payments')
      .select('*, students:student_id(full_name, class_name), profiles:parent_id(full_name)');

    if (parentId) {
      query = query.eq('parent_id', parentId).order('due_date', { ascending: true });
    } else {
      query = query.order('due_date', { ascending: false });
    }

    const { data: dbPayments, error } = await query;

    if (!error && dbPayments && dbPayments.length > 0) {
      const mappedPayments: Payment[] = dbPayments.map((p: any) => {
        const amount = Number(p.amount || 0);
        const discount = Number(p.discount_amount || 0);
        const total = Number(p.final_amount || amount);

        return {
          id: p.asaas_payment_id || p.id,
          childId: p.student_id || '',
          childName: p.students?.full_name || 'Aluno(a)',
          parentName: p.profiles?.full_name || '',
          reference: p.title || `Mensalidade ${p.due_date}`,
          dueDate: p.due_date,
          amount,
          discount,
          fine: 0,
          totalAmount: total,
          status: p.status as 'paid' | 'pending' | 'overdue' | 'cancelled',
          paymentPlan: p.billing_type === 'ANNUAL' ? 'annual' : 'monthly',
          paidAt: p.paid_at || undefined,
          paidAmount: p.status === 'paid' ? total : undefined,
          barcode: p.invoice_url || undefined,
          pixCode: p.pix_copy_paste || undefined,
          pixQrCodeData: p.pix_qr_code_image || undefined,
          isAsaas: !!p.asaas_payment_id,
        };
      });

      return NextResponse.json({
        payments: mappedPayments,
        source: 'supabase_live',
        count: mappedPayments.length,
      });
    }

    // Se não houver pagamentos cadastrados no Supabase para este filtro:
    return NextResponse.json({
      payments: [],
      source: 'supabase_empty',
      count: 0,
    });
  } catch (error: any) {
    console.error('[API Payments List Error]:', error);
    return NextResponse.json({
      payments: [],
      source: 'error',
      error: error.message,
    }, { status: 500 });
  }
}
