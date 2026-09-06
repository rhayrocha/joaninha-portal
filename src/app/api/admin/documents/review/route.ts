import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { documentId, action, rejectionReason } = await req.json();

    if (!documentId || !['approved', 'rejected'].includes(action)) {
      return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 });
    }

    const supabase = getAdminClient();

    const { data, error } = await supabase
      .from('documents')
      .update({
        status: action,
        rejection_reason: action === 'rejected' ? rejectionReason : null,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', documentId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: action === 'approved' ? 'Documento aprovado!' : 'Documento rejeitado.',
      document: data,
    });
  } catch (error: any) {
    console.error('[Admin Review Doc Error]:', error);
    return NextResponse.json({ error: error.message || 'Erro interno' }, { status: 500 });
  }
}
