import { NextRequest, NextResponse } from 'next/server';
import { asaas } from '@/lib/asaas';
import { getAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    let asaasId = params.id;
    const supabase = getAdminClient();

    // Se o ID for um UUID do Supabase, localiza o asaas_payment_id
    if (!asaasId.startsWith('pay_')) {
      const { data: p } = await supabase
        .from('payments')
        .select('asaas_payment_id, pix_copy_paste, pix_qr_code_image')
        .eq('id', asaasId)
        .single();
      
      if (p?.pix_copy_paste && p?.pix_qr_code_image) {
        return NextResponse.json({
          payload: p.pix_copy_paste,
          encodedImage: p.pix_qr_code_image,
          expirationDate: new Date(Date.now() + 86400000).toISOString(),
        });
      }

      if (p?.asaas_payment_id) {
        asaasId = p.asaas_payment_id;
      }
    }

    const pixData = await asaas.getPixQrCode(asaasId);

    // Salva em cache no Supabase
    if (pixData.payload) {
      await supabase
        .from('payments')
        .update({
          pix_copy_paste: pixData.payload,
          pix_qr_code_image: pixData.encodedImage,
        })
        .or(`asaas_payment_id.eq.${asaasId},id.eq.${params.id}`);
    }

    return NextResponse.json(pixData);
  } catch (error: any) {
    console.error('[API Payment Pix] Erro:', error);
    return NextResponse.json({ error: error.message || 'Erro ao gerar Pix no Asaas' }, { status: 500 });
  }
}
