import { NextRequest, NextResponse } from 'next/server';
import { asaas } from '@/lib/asaas';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const pixData = await asaas.getPixQrCode(params.id);
    return NextResponse.json(pixData);
  } catch (error: any) {
    console.error('[API Payment Pix] Erro:', error);
    return NextResponse.json({ error: error.message || 'Erro ao gerar Pix no Asaas' }, { status: 500 });
  }
}
